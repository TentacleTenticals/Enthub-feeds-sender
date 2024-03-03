import { createServer } from 'http';
import { createYoga } from 'graphql-yoga';
import { schema } from './templates/t.ts';
import {link} from './templates/link.ts';
import {yo} from './templates/yo.ts';

function main() {
  const yoga = createYoga({ schema, link, yo });
  const server = createServer(yoga);
  server.listen(4000, () => {
    console.info('Yoga server is running on http://localhost:4000/graphql');
  })
}

main()