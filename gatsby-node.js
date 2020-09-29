import path from 'path';
import fetch from 'isomorphic-fetch';

async function turnPizzasIntoPages({ graphql, actions }) {
  // 1. Get a template for this page
  const pizzaTemplate = path.resolve('./src/templates/Pizza.js');
  // 2. Query all pizzas
  const { data } = await graphql(`
    query {
      pizzas: allSanityPizza {
        nodes {
          name
          slug {
            current
          }
        }
      }
    }
  `);
  // 3. Loop over each pizza and create a page for that pizza
  data.pizzas.nodes.forEach((pizza) => {
    actions.createPage({
      path: `pizza/${pizza.slug.current}`,
      component: pizzaTemplate,
      context: {
        slug: pizza.slug.current,
      },
    });
  });
}

async function turnToppingsIntoPages({ graphql, actions }) {
  const toppingTemplate = path.resolve('./src/pages/pizzas.js');
  const { data } = await graphql(`
    query {
      toppings: allSanityTopping {
        nodes {
          name
          id
        }
      }
    }
  `);
  data.toppings.nodes.forEach((topping) => {
    actions.createPage({
      path: `topping/${topping.name}`,
      component: toppingTemplate,
      context: {
        topping: topping.name,
        // TODO REGEX for topping
      },
    });
  });
}

async function fetchBeersAndTurnIntoNodes({
  actions,
  createNodeId,
  createContentDigest,
}) {
  const res = await fetch('https://sampleapis.com/beers/api/ale');
  const beers = await res.json();
  for (const beer of beers) {
    const nodeMeta = {
      id: createNodeId(`beer-${beer.name}`),
      parent: null,
      children: [],
      internal: {
        type: 'Beer',
        mediaType: 'application/json',
        contentDigest: createContentDigest(beer),
      },
    };
    const node = { ...beer, ...nodeMeta };
    actions.createNode(node);
  }
}

async function fetchDocsAndTurnIntoNodes({
  actions,
  createNodeId,
  createContentDigest,
}) {
  const res = await fetch(
    'https://website-api.doctorshosp.com/doctors?include=specialities'
  );
  const data = await res.json();
  const doctors = data.data;

  for (const doctor of doctors) {
    const nodeMeta = {
      id: createNodeId(`Doctor-${doctor.id}`),
      phones: ['', [], ['']].indexOf(doctor.phones) + 1 ? null : doctor.phones,
      parent: null,
      children: [],
      internal: {
        type: 'Doctor',
        mediaType: 'application/json',
        contentDigest: createContentDigest(doctor),
      },
    };

    const node = { ...doctor, ...nodeMeta };
    actions.createNode(node);
  }
}
async function turnSliceMastersIntoPages({ graphql, actions }) {
  // 1. Query all slicemasters
  const { data } = await graphql(`
    query {
      sliceMasters: allSanityPerson {
        totalCount
        nodes {
          name
          id
          slug {
            current
          }
        }
      }
    }
  `);
  // TODO 2. Turn each slicemaster into a page
  // 3. Figure out how many pages there are based on how many slice masters there are and how many per page
  const pageSize = parseInt(process.env.GATSBY_PAGE_SIZE);
  const pageCount = Math.ceil(data.sliceMasters.totalCount / pageSize);

  console.log(
    `There are ${data.sliceMasters.totalCount} people. And we have ${pageCount} pages with ${pageSize} per page`
  );
  // 4. loop through 1 - n and create pages for them
  Array.from({ length: pageCount }).forEach((_, i) => {
    console.log(`Creating Page ${i}`);
    actions.createPage({
      path: `/slicemasters/${i + 1}`,
      component: path.resolve('./src/pages/slicemasters.js'),
      context: {
        skip: i * pageSize,
        currentPage: i + 1,
        pageSize,
      },
    });
  });
}
export async function sourceNodes(params) {
  // fetch a list of stuff
  await Promise.all([
    fetchBeersAndTurnIntoNodes(params),
    fetchDocsAndTurnIntoNodes(params),
  ]);
}

export async function createPages(params) {
  // Create pages dynamically
  await Promise.all([
    turnPizzasIntoPages(params),
    turnToppingsIntoPages(params),
    turnSliceMastersIntoPages(params),
  ]);
  // 1. Pizzas
  // 2. Toppings
  // 3. Slicemasters
}
