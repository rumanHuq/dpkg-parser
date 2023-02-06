import { parseName, parseDescription, parseDependencies } from "./dpkg";

const haystack = `Package: gettext
Status: install ok installed
Multi-Arch: allowed
Priority: optional
Section: devel
Installed-Size: 4124
Maintainer: Ubuntu Developers <ubuntu-devel-discuss@lists.ubuntu.com>
Architecture: amd64
Version: 0.18.1.1-5ubuntu3
Provides: libasprintf-dev, libgettextpo-dev
Depends: libc6 (>= 2.4), libcroco3 (>= 0.6.2), libglib2.0-0 (>= 2.12.0), libgomp1 (>= 4.2.1), libncurses5 (>= 5.5-5~), libtinfo5, libunistring0, libxml2 (>= 2.6.27), libgettextpo0 (= 0.18.1.1-5ubuntu3), gettext-base, dpkg (>= 1.15.4) | install-info
Recommends: curl | wget | lynx-cur
Suggests: gettext-doc
Conflicts: autopoint (<= 0.17-11)
Description: GNU Internationalization utilities
 Interesting for authors or maintainers of other packages or programs
 which they want to see internationalized.
Homepage: http://www.gnu.org/software/gettext/
Original-Maintainer: Santiago Vila <sanvila@debian.org>`;

describe("parseName", () => {
  it("should extract package name from text blob", () => {
    const packageName = parseName(haystack);
    expect(packageName).toBe("gettext");
  });

  it("should throw error if valid package string not found", () => {
    const packageName = () => parseName("PACKAGE: gettext\n");
    expect(packageName).toThrowError(`Key "Package" not found`);
  });
});

describe("parseDescription", () => {
  it("should extract package description from text blob", () => {
    const packageDescription = parseDescription(haystack);
    expect(packageDescription.includes("GNU Internationalization utilities")).toBe(true);
  });

  it("should throw error if valid Description string not found", () => {
    const packageDescription = () => parseDescription("no valid texts");
    expect(packageDescription).toThrowError(`Key "Description" not found`);
  });
});

describe("parseDependencies", () => {
  it("should extract package dependencies from text blob", () => {
    const packageDependencies = parseDependencies(haystack);
    expect(packageDependencies).toEqual([
      { main: "libc6", alternatives: [] },
      { main: "libcroco3", alternatives: [] },
      { main: "libglib2.0-0", alternatives: [] },
      { main: "libgomp1", alternatives: [] },
      { main: "libncurses5", alternatives: [] },
      { main: "libtinfo5", alternatives: [] },
      { main: "libunistring0", alternatives: [] },
      { main: "libxml2", alternatives: [] },
      { main: "libgettextpo0", alternatives: [] },
      { main: "gettext-base", alternatives: [] },
      { main: "dpkg", alternatives: ["install-info"] },
    ]);
  });

  it("return empty array if dependencies identifier not found", () => {
    const packageDependencies = parseDependencies("no valid texts");
    expect(packageDependencies).toEqual([]);
  });
  it("should throw error if dependencies string does not have valid main package", () => {
    const packageDependencies = () => parseDependencies("\nDepends: libc6 (>= 2.4),  | alt\n");
    expect(packageDependencies).toThrowError("Invalid dependency format (libc6 (>= 2.4),  | alt)");
  });
});
