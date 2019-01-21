const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// so we can do things like `expect(1 + 1).to.equal(2);`
// http://chaijs.com/api/bdd/
const expect = chai.expect;

chai.use(chaiHttp);

describe("Recipes", function() {
    
    before(function() {
      return runServer();
    });

    after(function() {
        return closeServer();
      });
      
      it("should list recipes on GET", function() {

        return chai
          .request(app)
          .get("/recipes")
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a("array");
    
            // because we create three items on app load
            expect(res.body.length).to.be.at.least(1);
            // each item should be an object with key/value pairs
            // for `id`, `name` and `checked`.
            const expectedKeys = ["id", "name", "ingredients"];
            res.body.forEach(function(item) {
              expect(item).to.be.a("object");
              expect(item).to.include.keys(expectedKeys);
            });
          });
      });

      it("should add an recipes on POST", function() {
        const newRecipe = { name: "coffee", INgredients: ['ground coffee', 'hot water']};
        return chai
          .request(app)
          .post("/recipes")
          .send(newRecipe)
          .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a("object");
            expect(res.body).to.include.keys("id", "name", "ingredients");
            expect(res.body.id).to.not.equal(null);
            // response should be deep equal to `newItem` from above if we assign
            // `id` to it from `res.body.id`
            expect(res.body).to.deep.equal(
              Object.assign(newRecipe, { id: res.body.id })
            );
          });
      });
    });

    