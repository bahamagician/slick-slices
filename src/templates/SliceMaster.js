import React from 'react';
import Img from 'gatsby-image';
import SEO from '../components/SEO';

export default function SingleSliceMasterPage({ data }) {
  return (
    <>
      <SEO title={`Slicemaster ${data.slicemaster.name}`} />
      <div className="center">
        <Img fluid={data.slicemaster.image.asset.fluid} />
        <h2>
          <span className="mark">{data.slicemaster.name}</span>
        </h2>
        <p>{data.slicemaster.description}</p>
      </div>
    </>
  );
}

export const query = graphql`
  query($slug: String!) {
    slicemaster: sanityPerson(slug: { current: { eq: $slug } }) {
      name
      id
      image {
        asset {
          fluid(maxWidth: 800) {
            ...GatsbySanityImageFluid
          }
        }
      }
      description
    }
  }
`;
