describe("Tech Quiz End-to-End", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("starts and completes the quiz", () => {
    // Start the quiz
    cy.contains("Start Quiz").click();

    // Wait for questions to load and answer them
    cy.intercept("GET", "/api/questions", (req) => {
      req.reply({
        statusCode: 200,
        body: [
          {
            question: "Sample question 1?",
            answers: [
              { text: "Answer 1", isCorrect: true },
              { text: "Answer 2", isCorrect: false },
              { text: "Answer 3", isCorrect: false },
              { text: "Answer 4", isCorrect: false },
            ],
          },
        ],
      });
    }).as("loadQuestions");
    cy.wait("@loadQuestions");

    // Answer the question
    cy.contains("Answer 1").click();
    cy.contains("Quiz Completed").should("be.visible");
    cy.contains("Your score: 1/1").should("be.visible");
  });
});
