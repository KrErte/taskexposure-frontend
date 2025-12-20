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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './shared/layout/layout.component';
import { EntryComponent } from './screens/entry/entry.component';
import { InputMethodComponent } from './screens/input-method/input-method.component';
import { ManualInputComponent } from './screens/manual-input/manual-input.component';
import { ClarifyingQuestionsComponent } from './screens/clarifying-questions/clarifying-questions.component';
import { AssessmentJustificationComponent } from './screens/assessment-justification/assessment-justification.component';
import { RiskScoreComponent } from './screens/risk-score/risk-score.component';
import { RiskBreakdownComponent } from './screens/risk-breakdown/risk-breakdown.component';
import { RoadmapComponent } from './screens/roadmap/roadmap.component';
import { SummaryComponent } from './screens/summary/summary.component';

export type Screen =
  | 'entry'
  | 'input-method'
  | 'manual-input'
  | 'clarifying-questions'
  | 'assessment-justification'
  | 'risk-score'
  | 'risk-breakdown'
  | 'roadmap'
  | 'summary';

export interface Task {
  description: string;
  exposure: 'high' | 'medium' | 'low';
  reason: string;
}

export interface ClarifyingQuestion {
  id: number;
  context: string;
  question: string;
  options: string[];
}

export interface RoadmapAction {
  description: string;
  explanation: string;
  impact: string;
}

export interface AssessmentData {
  tasks: Task[];
  clarifyingAnswers: Map<number, number>;
  riskScore: number;
  signalStrength: 'Low' | 'Moderate' | 'High';
  aiCapabilities: string[];
  aiLimitations: string[];
  roadmapActions: RoadmapAction[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    LayoutComponent,
    EntryComponent,
    InputMethodComponent,
    ManualInputComponent,
    ClarifyingQuestionsComponent,
    AssessmentJustificationComponent,
    RiskScoreComponent,
    RiskBreakdownComponent,
    RoadmapComponent,
    SummaryComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  currentScreen: Screen = 'entry';

  assessmentData: AssessmentData = {
    tasks: [],
    clarifyingAnswers: new Map(),
    riskScore: 0,
    signalStrength: 'Moderate',
    aiCapabilities: [],
    aiLimitations: [],
    roadmapActions: [],
  };

  navigateTo(screen: Screen): void {
    this.currentScreen = screen;
    window.scrollTo(0, 0);
  }

  onTasksSubmitted(tasks: string[]): void {
    this.assessmentData.tasks = this.generateMockTaskAnalysis(tasks);
    this.navigateTo('clarifying-questions');
  }

  onClarifyingComplete(answers: Map<number, number>): void {
    this.assessmentData.clarifyingAnswers = answers;
    this.generateMockAssessment();
    this.navigateTo('assessment-justification');
  }

  private generateMockTaskAnalysis(taskDescriptions: string[]): Task[] {
    const mockAnalysis: Task[] = [
      {
        description: taskDescriptions[0] || 'Data entry and record keeping',
        exposure: 'high',
        reason:
          'Structured data processing is a core capability of current AI systems. Pattern recognition and data transformation tasks show high automation potential.',
      },
      {
        description: taskDescriptions[1] || 'Report generation and formatting',
        exposure: 'high',
        reason:
          'Document generation from templates and data sources is well within current AI capabilities. Formatting and structure adherence are automated effectively.',
      },
      {
        description: taskDescriptions[2] || 'Client communication and coordination',
        exposure: 'medium',
        reason:
          'Routine communication can be automated, but relationship management and context-sensitive responses require human judgment.',
      },
      {
        description: taskDescriptions[3] || 'Strategic planning and decision-making',
        exposure: 'low',
        reason:
          'Long-term strategic decisions involving accountability, stakeholder management, and organizational politics remain human-dependent.',
      },
      {
        description: taskDescriptions[4] || 'Team leadership and mentoring',
        exposure: 'low',
        reason:
          'Interpersonal leadership, performance management, and career development guidance require human presence and accountability.',
      },
    ].slice(0, taskDescriptions.length);

    return mockAnalysis;
  }

  private generateMockAssessment(): void {
    const highCount = this.assessmentData.tasks.filter((t) => t.exposure === 'high').length;
    const mediumCount = this.assessmentData.tasks.filter((t) => t.exposure === 'medium').length;
    const totalTasks = this.assessmentData.tasks.length;

    this.assessmentData.riskScore = Math.round(
      ((highCount * 1 + mediumCount * 0.5) / totalTasks) * 100
    );

    this.assessmentData.signalStrength =
      totalTasks >= 5 ? 'High' : totalTasks >= 3 ? 'Moderate' : 'Low';

    this.assessmentData.aiCapabilities = [
      'Processing and transforming structured data across multiple formats',
      'Generating reports and documents from templates and data sources',
      'Scheduling, routing, and coordinating routine communications',
      'Pattern recognition in historical records and datasets',
      'Automated quality checks against defined criteria',
    ];

    this.assessmentData.aiLimitations = [
      'Accountability for decisions with significant organizational impact',
      'Navigating ambiguous situations requiring stakeholder judgment',
      'Building and maintaining trust-based professional relationships',
      'Adapting to novel situations outside training distribution',
    ];

    this.assessmentData.roadmapActions = [
      {
        description: 'Take ownership of decisions that carry organizational risk',
        explanation:
          'Position yourself as the accountable party for outcomes that matter. AI systems cannot bear responsibility or face consequences.',
        impact: 'Moves task from high → low exposure',
      },
      {
        description: 'Develop expertise in exception handling and edge cases',
        explanation:
          'Systems fail at boundaries. Become the person who handles what automation cannot predict.',
        impact: 'Moves task from medium → low exposure',
      },
      {
        description: 'Build relationships that require trust and continuity',
        explanation:
          'Long-term stakeholder relationships depend on personal history and mutual understanding that cannot be transferred to a system.',
        impact: 'Moves task from medium → low exposure',
      },
    ];
  }
}
