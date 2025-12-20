/*
 * Copyright 2025 TASKEXPOSURE
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< Updated upstream
import { Task } from '../../app.component';
import { CLARIFYING_QUESTIONS_COPY } from '../../shared/content/copy';
=======
import { Task } from '../../shared/models/task.model';
>>>>>>> Stashed changes

interface ClarifyingQuestion {
  id: number;
  context: string;
  question: string;
  options: string[];
}

@Component({
  selector: 'app-clarifying-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clarifying-questions.component.html',
  styleUrl: './clarifying-questions.component.scss',
})
export class ClarifyingQuestionsComponent implements OnInit {
  @Input() tasks: Task[] = [];
  @Output() complete = new EventEmitter<Map<number, number>>();

  readonly copy = CLARIFYING_QUESTIONS_COPY;

  questions: ClarifyingQuestion[] = [];
  currentQuestionIndex: number = 0;
  answers: Map<number, number> = new Map();

  get currentQuestion(): ClarifyingQuestion | null {
    return this.questions[this.currentQuestionIndex] || null;
  }

  get hasSelectedAnswer(): boolean {
    return this.currentQuestion !== null && this.answers.has(this.currentQuestion.id);
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  get progressLabel(): string {
    if (this.copy.progressLabel) {
      return this.copy.progressLabel(this.currentQuestionIndex + 1, this.questions.length);
    }
    return '';
  }

  get ctaLabel(): string {
    return this.isLastQuestion
      ? (this.copy.labels?.['finish'] || this.copy.cta.primary)
      : (this.copy.labels?.['next'] || 'Next');
  }

  ngOnInit(): void {
    this.generateQuestions();
  }

  private generateQuestions(): void {
    this.questions = [
      {
        id: 1,
        context: 'You mentioned tasks involving data or information processing.',
        question: 'Which best describes your involvement?',
        options: [
          'Following established procedures and templates',
          'Designing new procedures based on changing requirements',
          'Both equally',
        ],
      },
      {
        id: 2,
        context: 'You mentioned communication-related tasks.',
        question: 'Which best describes your communication responsibilities?',
        options: [
          'Routine updates and status reports',
          'Negotiating outcomes with stakeholders',
          'Both equally',
        ],
      },
      {
        id: 3,
        context: 'You mentioned work involving analysis or review.',
        question: 'Which best describes your analytical work?',
        options: [
          'Checking against defined criteria',
          'Evaluating trade-offs with incomplete information',
          'Both equally',
        ],
      },
    ];
  }

  selectAnswer(optionIndex: number): void {
    if (this.currentQuestion) {
      this.answers.set(this.currentQuestion.id, optionIndex);
    }
  }

  nextQuestion(): void {
    if (this.isLastQuestion) {
      this.complete.emit(this.answers);
    } else {
      this.currentQuestionIndex++;
    }
  }
}
