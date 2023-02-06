import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Package, PackageRecord } from "@/lib/dpkg/dpkg";
import { Container, PackageWrapper, Name, Information, Title, DependencyTree, Scrollable } from "@/styles/[pkg]";

interface DependencyProps {
  title: string;
  packageRecord?: PackageRecord;
  isLast: boolean;
}

const Dependency = ({ title, packageRecord, isLast }: DependencyProps) => {
  if (!packageRecord) return null;
  if (packageRecord[title]) {
    return (
      <Link href={`/${title}`}>
        {title}
        {!isLast && ", "}
      </Link>
    );
  }
  return (
    <span style={{ color: "#bbb" }}>
      {title}
      {!isLast && ", "}
    </span>
  );
};

export default function PackagePage() {
  const { query, push } = useRouter();
  const [packageRecord, setPackageRecord] = useState<PackageRecord>();
  const [pkg, setPkg] = useState<Package>();

  useEffect(() => {
    if (typeof window !== undefined) {
      const found = window.localStorage.getItem("dependencies");
      if (found) {
        const dependenciesParsed = JSON.parse(found);
        setPackageRecord(dependenciesParsed);
        setPkg(dependenciesParsed[query.pkg as string]);
      } else {
        void push("/");
      }
    }
  }, [push, query]);

  if (!pkg) return null;

  return (
    <Container>
      <PackageWrapper>
        <Name>
          <h6>Package:</h6>
          <h2>{pkg.name}</h2>
          <Link href="/">View all dependencies</Link>
        </Name>
        <Information>
          <Title>description:</Title>
          <Scrollable>
            {/* eslint-disable-next-line react/no-danger */}
            <pre dangerouslySetInnerHTML={{ __html: pkg.description }} />
          </Scrollable>
          <Title>Depends on:</Title>
          <Scrollable>
            {pkg.dependencies.map((dep, key) => (
              <DependencyTree key={key}>
                <dt>main: &nbsp;</dt>
                <dd>
                  <Dependency {...{ title: dep.main, packageRecord, isLast: true }} />
                </dd>
                <br />
                <dt>alternatives:&nbsp;</dt>
                <dd>
                  {dep.alternatives.length
                    ? dep.alternatives.map((title, k) => (
                        <Dependency
                          {...{ title, key: k, packageRecord, isLast: dep.alternatives.length - 1 === key }}
                        />
                      ))
                    : "None"}
                </dd>
              </DependencyTree>
            ))}
          </Scrollable>
          <Title>Dependent packages:</Title>
          <Scrollable>
            {pkg.dependentPackages.map((title, key) => (
              <Dependency
                {...{
                  title,
                  packageRecord,
                  key,
                  isLast: pkg.dependentPackages.length - 1 === key,
                }}
              />
            ))}
          </Scrollable>
        </Information>
      </PackageWrapper>
    </Container>
  );
}
