export const getCollectionsForNav = `
{
  collections(first: 10) {
    edges {
      node {
        id
        title
        handle
      }
    }
  }
}
`;
