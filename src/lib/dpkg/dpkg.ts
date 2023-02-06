import { readFile } from "node:fs/promises";

interface Dependency {
  main: string;
  alternatives: string[];
}

export interface Package {
  name: string;
  description: string;
  dependencies: Dependency[];
  dependentPackages: string[];
}

export type PackageRecord = Record<string, Package>;

export function parseName(haystack: string): string {
  const needle = /Package:\s(.+)\n/;
  const found = needle.exec(haystack)?.[1];
  if (!found) throw new Error(`Key "Package" not found`);

  return found;
}

export function parseDescription(haystack: string): string {
  const needle = /Description:\s(.+\n(\s.+\n)*)/;
  const found = needle.exec(haystack)?.[1];
  if (!found) throw new Error(`Key "Description" not found`);

  return found;
}

export function parseDependencies(haystack: string): Dependency[] {
  const needle = /Depends:\s(.+)\n/;
  const found = needle.exec(haystack)?.[1];
  if (!found) return [];

  // 'libc6 (>= 2.2.5)' -> 'libc6'
  const stripVersionNumberFromGivenPackage = (packageString: string): string => packageString.split(" ")[0];

  /*
   * FROM string => 'libc6 (>= 2.2.5), dpkg (>= 1.15.4) | install-info'
   * INTO array => [{ main: 'libc6', alternatives: [] }, { main: 'dpkg', alternatives: ['install-info'] }]
   */
  const dependencies = found.split(", ").map((string) => {
    const [mainWithVersion, ...alternatives] = string.split(" | ");
    const main = stripVersionNumberFromGivenPackage(mainWithVersion);
    if (!main) throw new Error(`Invalid dependency format (${found})`);

    const dependency = {
      main,
      alternatives: alternatives.map(stripVersionNumberFromGivenPackage),
    };
    return dependency;
  });

  // Filter out duplicates
  return dependencies.filter(
    (dependency, index) =>
      dependencies.findIndex((otherDependency) => otherDependency.main === dependency.main) === index
  );
}

function parsePackage(text: string, index: number): Package {
  try {
    return {
      name: parseName(text),
      description: parseDescription(text),
      dependencies: parseDependencies(text),
      dependentPackages: [],
    };
  } catch (error) {
    throw new Error(`Failed to parse entry ${index}: ${error.message}`);
  }
}

function PackageRecordWithDependentPackages(PackageRecordBase: PackageRecord): PackageRecord {
  const PackageRecord = structuredClone(PackageRecordBase);
  Object.entries(PackageRecord).forEach(([name, pkg]) => {
    const flatDependencies = pkg.dependencies.flatMap((dependency: Dependency) => [
      dependency.main,
      ...dependency.alternatives,
    ]);

    flatDependencies.forEach((dependencyName) => {
      if (PackageRecord[dependencyName] && !PackageRecord[dependencyName].dependentPackages.includes(name)) {
        PackageRecord[dependencyName].dependentPackages.push(name);
      }
    });
  });

  return PackageRecord;
}

export async function getPackageRecord(filePath: string): Promise<PackageRecord> {
  const content = await readFile(filePath, "utf8");
  const PackageRecord = content
    .split("\n\n")
    .filter((block: string) => block.trim() !== "")
    .map(parsePackage)
    .reduce((dictionary: PackageRecord, pkg: Package) => ({ ...dictionary, [pkg.name]: pkg }), {});

  return PackageRecordWithDependentPackages(PackageRecord);
}
