import {Polly} from '@pollyjs/core';

const FetchAdapter = require('@pollyjs/adapter-xhr');

Polly.register(FetchAdapter as any);


describe('TypeScript', () => {

  it('should use the mocked polly server to stub response', () => {

    cy.visit('/index.html', {
      onBeforeLoad(win: Window): void {
        (win as unknown as any).yyy = 'Hi, xxx';
        const polly = new Polly('Simple Client-Side Server Example', {
          adapters: ['xhr'], // Hook into `xhr`
          adapterOptions: {
            // FIXME
            // which is not supported yet, wait for this PR merge
            // https://github.com/Netflix/pollyjs/pull/216
            xhr: {
              context: win
            }
          },
          logging: true // Log requests to console
        });
        const {server} = polly;
        const baseUrl = Cypress.config().baseUrl;
        const url = `${baseUrl}/data.json`;
        console.log(url);
        server.get(url).intercept((req, res) => {
          const header = req.headers['myHeader'];
          res.status(200).json({hello: header});
        });
      }
    })
      .get('#button1')
      .click()
      .get('#message')
      .should('have.text', 'aaa');
  });
})
