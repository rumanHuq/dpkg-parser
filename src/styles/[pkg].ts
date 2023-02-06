import styled from "styled-components";

export const Container = styled.section`
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;

  p,
  dl {
    margin: 0;
  }
`;

export const Scrollable = styled.div`
  max-height: 100px;
  overflow-y: auto;
`;

export const PackageWrapper = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  margin: 20px;
  overflow: hidden;
  width: 700px;
`;

export const Name = styled.div`
  background-color: #2a265f;
  color: #fff;
  flex: 1;
  padding: 30px;

  h6 {
    letter-spacing: 1px;
    margin: 0;
    opacity: 0.6;
    text-transform: uppercase;
  }

  h2 {
    letter-spacing: 1px;
    margin: 10px 0;
    width: max-content;
  }

  a {
    color: #fff;
    display: inline-block;
    font-size: 12px;
    margin-top: 30px;
    opacity: 0.6;
    text-decoration: none;
  }
`;

export const Information = styled.div`
  color: #111;
  font-size: 0.8rem;
  padding: 30px;
`;

export const Title = styled.p`
  font-weight: bold;
  letter-spacing: 1px;
  opacity: 0.6;
  padding-bottom: 0.5rem;
  text-transform: uppercase;

  &:not(:first-child) {
    margin-top: 2rem;
  }
`;

export const DependencyTree = styled.dl`
  dt,
  dd {
    display: inline-block;
  }

  dt {
    font-weight: bold;
  }

  dd {
    margin: 0;

    &:not(:last-child) {
      margin-top: 0.3rem;
    }
  }
`;
