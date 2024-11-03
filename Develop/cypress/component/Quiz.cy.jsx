import React from 'react';
import { mount } from '@cypress/react';
import Quiz from '../../client/src/components/Quiz';

// Mock the `getQuestions` function to return sample data
const mockQuestions = [
  {
    question: 'What is the capital of France?',
    answers: [
      { text: 'Paris', isCorrect: true },
      { text: 'Berlin', isCorrect: false },
      { text: 'Madrid', isCorrect: false },
      { text: 'Rome', isCorrect: false },
    ],
  },
  {
    question: 'What is 2 + 2?',
    answers: [
      { text: '3', isCorrect: false },
      { text: '4', isCorrect: true },
      { text: '5', isCorrect: false },
      { text: '6', isCorrect: false },
    ],
  },
];

describe('Quiz Component', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/questions', {
      body: mockQuestions,
    }).as('getQuestions');
  });

  it('renders and starts the quiz', () => {
    mount(<Quiz />);
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');
    cy.contains(mockQuestions[0].question).should('be.visible');
  });

  it('handles question answering correctly', () => {
    mount(<Quiz />);
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Answer the first question correctly
    cy.contains(mockQuestions[0].answers[0].text).click();
    cy.contains(mockQuestions[1].question).should('be.visible');

    // Answer the second question correctly
    cy.contains(mockQuestions[1].answers[1].text).click();
    cy.contains('Quiz Completed').should('be.visible');
    cy.contains('Your score: 2/2').should('be.visible');
  });
});
