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

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutComponent } from './shared/layout/layout.component';

import { Task } from './shared/models/task.model';
import { AssessmentData, SignalStrength } from './shared/models/assessment.model';

import { EntryComponent } from './screens/entry/entry.component';
import { InputMethodComponent } from './screens/input-method/input-method.component';
import { ManualInputComponent } from './screens/manual-input/manual-input.component';
import { ClarifyingQuestionsComponent } from './screens/clarifying-questions/clarifying-questions.component';
import { AssessmentJustificationComponent } from './screens/assessment-justification/assessment-justification.component';
import { RiskScoreComponent } from './screens/risk-score/risk-score.component';
import { RiskBreakdownComponent } from './screens/risk-breakdown/risk-breakdown.component';
import { RoadmapComponent } from './screens/roadmap/roadmap.component';
import { SummaryComponent } from './screens/summary/summary.component';
import { RiskApiService } from './core/services/risk-api.service';
import {
  AnalyzeResponse,
  RefineResponse,
  ClarifyingQuestion as ApiClarifyingQuestion,
} from './core/models/risk-api.models';
import { SkeletonLoaderComponent } from './shared/components/skeleton-loader/skeleton-loader.component';
import { ToastContainerComponent } from './shared/components/toast-container/toast-container.component';
import { EmptyStateComponent } from './shared/components/empty-state/empty-state.component';
import { ToastService } from './core/services/toast.service';

type ScreenId =
  | 'entry'
  | 'input-method'
  | 'manual-input'
  | 'clarifying-questions'
  | 'assessment-justification'
  | 'risk-score'
  | 'risk-breakdown'
  | 'roadmap'
  | 'summary';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,

    // Layout wrapper used in app.component.html
    LayoutComponent,

    // Shared components
    SkeletonLoaderComponent,
    ToastContainerComponent,
    EmptyStateComponent,

    // Screens used in app.component.html
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
  private readonly riskApi = inject(RiskApiService);
  private readonly toast = inject(ToastService);

  // app.component.html uses this to switch sections
  currentScreen: ScreenId = 'entry';
  isLoading = false;
  errorMessage = '';
  isTransitioning = false;

  // API response data
  private analysisId = '';
  private apiClarifyingQuestions: ApiClarifyingQuestion[] = [];
  private analyzeResponse: AnalyzeResponse | null = null;
  private refineResponse: RefineResponse | null = null;

  // app.component.html expects assessmentData.*
  assessmentData: AssessmentData = this.createInitialMockAssessment();

  // Expose API clarifying questions for the component
  get clarifyingQuestions(): ApiClarifyingQuestion[] {
    return this.apiClarifyingQuestions;
  }

  navigateTo(screen: ScreenId): void {
    this.isTransitioning = true;

    setTimeout(() => {
      this.currentScreen = screen;
      this.errorMessage = '';
      window.scrollTo(0, 0);

      setTimeout(() => {
        this.isTransitioning = false;
      }, 50);
    }, 200);
  }

  onTasksSubmitted(tasks: string[]): void {
    this.isLoading = true;
    this.errorMessage = '';

    const request = {
      roleTitle: 'Professional',
      tenureYears: 3,
      contextText: tasks.join('\n'),
    };

    this.riskApi.analyze(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.analyzeResponse = response;
        this.analysisId = response.analysisId;
        this.apiClarifyingQuestions = response.clarifyingQuestions;

        // Map response to task format for display
        this.assessmentData.tasks = this.mapResponseToTasks(tasks, response);
        this.assessmentData.aiCapabilities = response.strengths;
        this.assessmentData.aiLimitations = response.risks;

        this.navigateTo('clarifying-questions');
      },
      error: (error) => {
        this.isLoading = false;
        this.toast.warning('Using demo mode - API unavailable');
        console.error('Analyze error:', error);
        // Fallback to mock data
        this.useFallbackForAnalysis(tasks);
      },
    });
  }

  onClarifyingComplete(answers: Map<string, string>): void {
    this.isLoading = true;
    this.errorMessage = '';

    const refineAnswers = Array.from(answers.entries()).map(([id, answer]) => ({
      id,
      answer,
    }));

    const request = {
      analysisId: this.analysisId,
      answers: refineAnswers,
    };

    this.riskApi.refine(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.refineResponse = response;

        // Update assessment data from refine response
        this.assessmentData.riskScore = response.replaceabilityPct;
        this.assessmentData.aiCapabilities = response.strengths;
        this.assessmentData.aiLimitations = response.risks;
        this.assessmentData.signalStrength = this.mapConfidenceToSignalStrength(response.confidence);

        // Map roadmap from response
        if (response.roadmap?.items) {
          this.assessmentData.roadmapActions = response.roadmap.items.map((item) => ({
            title: item.title,
            description: item.actions.join(' '),
            mechanism: item.output,
            impact: item.impact,
          }));
        }

        this.navigateTo('assessment-justification');
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to process answers. Please try again.';
        console.error('Refine error:', error);
        // Fallback: navigate anyway with existing mock data
        this.navigateTo('assessment-justification');
      },
    });
  }

  onShowScore(): void {
    this.navigateTo('risk-score');
  }

  onContinueFromScore(): void {
    this.navigateTo('risk-breakdown');
  }

  onGenerateRoadmap(): void {
    this.navigateTo('roadmap');
  }

  onFinish(): void {
    this.navigateTo('summary');
  }

  private useFallbackForAnalysis(tasks: string[]): void {
    // Fallback to mock data when API fails
    if (tasks?.length) {
      const newTasks = this.generateMockTaskAnalysis(tasks);
      this.assessmentData = { ...this.assessmentData, tasks: newTasks };
    }
    this.navigateTo('clarifying-questions');
  }

  private mapResponseToTasks(taskDescriptions: string[], response: AnalyzeResponse): Task[] {
    return taskDescriptions.map((description, index) => ({
      description,
      exposure: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
      reason: response.whySummary || 'Analysis based on AI capability assessment.',
    }));
  }

  private mapConfidenceToSignalStrength(confidence: string): SignalStrength {
    const conf = confidence?.toLowerCase() || 'medium';
    if (conf.includes('high')) return 'high';
    if (conf.includes('low')) return 'low';
    return 'moderate';
  }

  private createInitialMockAssessment(): AssessmentData {
    return {
      tasks: this.generateMockTaskAnalysis([]),
      aiCapabilities: [
        'Generating boilerplate code from specifications',
        'Summarizing documentation and meeting notes',
        'Identifying common bug patterns',
        'Drafting standard communications',
      ],
      aiLimitations: [
        'Negotiating scope with non-technical stakeholders',
        'Making architectural decisions with incomplete information',
        'Navigating ambiguous requirements',
        'Mentoring junior team members',
      ],
      signalStrength: 'moderate',
      riskScore: 47,
      roadmapActions: [
        {
          title: 'Shift from execution to judgment in code review',
          description:
            'Your current reviews focus on correctness and style. AI handles this well.',
          mechanism:
            'Focus reviews on architectural implications, long-term maintainability, and cross-system impact. Document trade-off reasoning, not just approval.',
          impact: 'Moves code review from high → low exposure',
        },
        {
          title: 'Own ambiguous problem definition',
          description:
            'Requirements clarification remains high-judgment work. Position yourself as the person who translates vague business needs into scoped technical work.',
          mechanism:
            'Drive problem framing, define constraints, and turn ambiguity into decisions others rely on.',
          impact: 'Creates dependency on synthesis ability, not output volume',
        },
        {
          title: 'Reduce documentation; increase decision documentation',
          description:
            'AI drafts docs. It cannot explain why a decision was made, what was considered, and what was rejected.',
          mechanism:
            'Keep a lightweight decision log focused on trade-offs and rejected options.',
          impact: 'Shifts documentation from high → medium exposure',
        },
      ],
    };
  }

  private generateMockTaskAnalysis(taskDescriptions: string[]): Task[] {
    const defaults: Task[] = [
      {
        description: 'Writing unit tests',
        exposure: 'high',
        reason: 'Automated test generation is production-ready',
      },
      {
        description: 'Debugging legacy code',
        exposure: 'medium',
        reason: 'Pattern recognition is strong, but context gaps remain',
      },
      {
        description: 'Technical documentation',
        exposure: 'high',
        reason: 'Summarization and drafting are mature',
      },
      {
        description: 'Sprint planning',
        exposure: 'low',
        reason: 'Requires negotiation, politics, judgment',
      },
      {
        description: 'Mentoring juniors',
        exposure: 'low',
        reason: 'Relationship-dependent, trust-based',
      },
    ];

    if (!taskDescriptions?.length) return defaults;

    // Replace descriptions with user-provided tasks where possible
    return defaults.map((t, idx) => ({
      ...t,
      description: taskDescriptions[idx] ?? t.description,
    }));
  }
}
