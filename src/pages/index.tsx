import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useEffect } from "react";
import styled from "styled-components";
import { getPackageRecord, PackageRecord } from "@/lib/dpkg/dpkg";

// const filePath = "/var/lib/dpkg/status";
const filePath = "src/status.txt";

const ListContainer = styled.ul`
  list-style: none;
  margin: 0;
  margin: auto;
  padding: 0;
  width: max-content;
`;

const List = styled.li`
  padding: 0.3rem;

  &:not(:last-child) {
    margin-bottom: 0.2rem;
  }

  &:hover {
    box-shadow: 0 0 5px 0 rgba(186, 218, 85, 0.45);
    box-sizing: border-box;
    font-weight: bold;
  }
`;

function useSetToLocalStorage(key: string, val: string) {
  useEffect(() => {
    if (typeof window !== undefined) {
      window.localStorage.setItem(key, val);
    }
  }, [key, val]);
}

const Home: NextPage<Info> = ({ packages }) => {
  useSetToLocalStorage("dependencies", JSON.stringify(packages));
  return (
    <ListContainer>
      {Object.keys(packages)
        .sort()
        .map((pkg, k) => (
          <List key={k}>
            <Link href={`/${pkg}`}>{pkg}</Link>
          </List>
        ))}
    </ListContainer>
  );
};

interface Info {
  packages: PackageRecord;
}

export const getServerSideProps: GetServerSideProps<Info> = async () => {
  return { props: { packages: await getPackageRecord(filePath) } };
};

export default Home;
