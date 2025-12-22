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

/**
 * Centralized copy for TASKEXPOSURE
 *
 * Narrative Arc:
 * 1. CALM: Entry establishes credibility and sets neutral expectations
 * 2. CONCERN: Score reveal creates honest awareness without panic
 * 3. CLARITY: Breakdown explains the "why" behind each assessment
 * 4. EMPOWERMENT: Actions provide concrete, achievable next steps
 */

export interface ScreenCopy {
  headline: string;
  subheadline?: string;
  body?: string[];
  cta: {
    primary: string;
    variants?: string[];
  };
  labels?: Record<string, string>;
  helper?: Record<string, string>;
}

export interface EntryCopy extends ScreenCopy {
  timeEstimate: string;
  requirements: string;
  deliverables: string[];
}

export interface InputMethodCopy extends ScreenCopy {
  options: {
    cv: { title: string; description: string; disabled: string };
    manual: { title: string; description: string };
  };
}

export interface ManualInputCopy extends ScreenCopy {
  instructions: string[];
  example: { bad: string; good: string };
  placeholder: string;
  counter: (current: number, min: number, max: number) => string;
}

export interface ClarifyingQuestionsCopy extends ScreenCopy {
  progressLabel?: (current: number, total: number) => string;
}

export interface AssessmentJustificationCopy extends ScreenCopy {
  sections: {
    capabilities: { title: string; description: string };
    limitations: { title: string; description: string };
    signalStrength: {
      title: string;
      label: string;
      explanation: Record<'Low' | 'Moderate' | 'High', string>;
      learnMore: {
        title: string;
        content: string[];
      };
    };
  };
}

export interface RiskScoreCopy extends ScreenCopy {
  headlineTemplate: (score: number) => string;
  bandLabels: {
    low: { label: string; range: string; meaning: string; action: string };
    moderate: { label: string; range: string; meaning: string; action: string };
    high: { label: string; range: string; meaning: string; action: string };
  };
  disclaimer: string;
}

export interface RiskBreakdownCopy extends ScreenCopy {
  exposureLabels: Record<'high' | 'medium' | 'low', string>;
  exposureDescriptors: Record<'high' | 'medium' | 'low', string>;
}

export interface RoadmapCopy extends ScreenCopy {
  actionPrefix: string;
  impactLabel: string;
}

export interface SummaryCopy extends ScreenCopy {
  sections: {
    score: string;
    highExposure: string;
    lowExposure: string;
    topAction: string;
  };
  download: string;
  nextSteps: string;
}

// =============================================================================
// SCREEN COPY DEFINITIONS
// =============================================================================

export const ENTRY_COPY: EntryCopy = {
  headline: 'See how to reduce your AI exposure',
  subheadline:
    "This assessment doesn't predict your future — it shows you exactly what to change. Analyze your actual tasks and get a personalized action plan.",
  body: [
    'Based on what you actually do, not your job title.',
  ],
  timeEstimate: 'Takes about 15 minutes',
  requirements: 'Works best with specific, honest descriptions of your work',
  deliverables: [
    'Task-level exposure analysis',
    'Specific reduction opportunities',
    'Your personalized action plan',
  ],
  cta: {
    primary: 'Start assessment',
    variants: ['Begin assessment', 'Get started'],
  },
};

export const INPUT_METHOD_COPY: InputMethodCopy = {
  headline: 'Choose how to provide your work information',
  body: [
    'The more specific your input, the more accurate your assessment.',
  ],
  options: {
    cv: {
      title: 'Upload your CV',
      description: 'Faster setup, but may need refinement',
      disabled: 'Coming soon',
    },
    manual: {
      title: 'Describe your tasks manually',
      description: 'Takes longer, but produces more accurate results',
    },
  },
  cta: {
    primary: 'Continue',
  },
};

export const MANUAL_INPUT_COPY: ManualInputCopy = {
  headline: 'Describe what you actually do at work',
  subheadline: 'Focus on activities, not titles or responsibilities.',
  instructions: [
    'Think about how you spend your time each week.',
    'Describe specific activities, not general categories.',
  ],
  example: {
    bad: '"Write code"',
    good: '"Debug authentication issues in legacy Java systems"',
  },
  placeholder: 'Describe a specific task or activity...',
  counter: (current: number, min: number, max: number) =>
    `${current} of ${min}-${max} tasks added`,
  cta: {
    primary: 'Analyze these tasks',
    variants: ['Continue to analysis', 'Proceed'],
  },
  labels: {
    addTask: 'Add task',
    remove: 'Remove',
  },
};

export const CLARIFYING_QUESTIONS_COPY: ClarifyingQuestionsCopy = {
  headline: 'A few clarifying questions',
  subheadline:
    'Similar-sounding tasks can have very different exposure profiles. These questions help us distinguish between them.',
  cta: {
    primary: 'Continue',
  },
  labels: {
    next: 'Next question',
    finish: 'See analysis',
  },
  progressLabel: (current: number, total: number) =>
    `Question ${current} of ${total}`,
};

export const ASSESSMENT_JUSTIFICATION_COPY: AssessmentJustificationCopy = {
  headline: 'Analysis complete',
  subheadline:
    'Before showing your score, here is the reasoning behind your assessment.',
  sections: {
    capabilities: {
      title: 'Where AI systems perform well',
      description: 'These capabilities overlap with parts of your described work:',
    },
    limitations: {
      title: 'Where AI systems struggle',
      description: 'These aspects of your work remain difficult to automate:',
    },
    signalStrength: {
      title: 'Assessment confidence',
      label: 'Signal strength',
      explanation: {
        Low: 'Limited input makes this assessment less precise. Consider adding more task details for a refined analysis.',
        Moderate: 'Sufficient detail for a reasonable assessment. Additional specificity would improve precision.',
        High: 'Strong input quality. This assessment reflects a detailed understanding of your work.',
      },
      learnMore: {
        title: 'How is signal strength calculated?',
        content: [
          'Signal strength reflects how much information we have to work with.',
          'It considers: number of tasks provided, specificity of descriptions, and consistency of clarifying answers.',
          'A low signal does not mean high or low exposure. It means the assessment has wider confidence intervals.',
          'You can improve signal strength by providing more tasks or more detailed descriptions.',
        ],
      },
    },
  },
  cta: {
    primary: 'View your score',
    variants: ['See your results', 'Show my score'],
  },
};

export const RISK_SCORE_COPY: RiskScoreCopy = {
  headline: 'Your AI exposure score',
  headlineTemplate: (score: number) =>
    `Your current role has ${score}% task exposure to AI`,
  bandLabels: {
    low: {
      label: 'Low exposure',
      range: '0-30%',
      meaning:
        'Most of your described tasks require capabilities that AI systems do not yet perform reliably.',
      action: 'Your work is well-positioned. See the breakdown to understand why.',
    },
    moderate: {
      label: 'Moderate exposure',
      range: '31-60%',
      meaning:
        'A significant portion of your tasks overlap with current or near-term AI capabilities.',
      action: 'There are specific changes you can make to reduce this.',
    },
    high: {
      label: 'High exposure',
      range: '61-100%',
      meaning:
        'Most of your described tasks can be performed by current or emerging AI systems.',
      action: 'The good news: targeted changes can significantly reduce this exposure.',
    },
  },
  disclaimer:
    'This is a task exposure assessment, not a job loss prediction. Exposure indicates overlap with AI capabilities, not replacement timeline.',
  cta: {
    primary: 'See task breakdown',
    variants: ['View breakdown', 'Understand this score'],
  },
};

export const RISK_BREAKDOWN_COPY: RiskBreakdownCopy = {
  headline: 'Exposure by task',
  subheadline: 'Each task is assessed individually based on its characteristics.',
  exposureLabels: {
    high: 'High',
    medium: 'Moderate',
    low: 'Low',
  },
  exposureDescriptors: {
    high: 'Significant overlap with AI capabilities',
    medium: 'Partial overlap with AI capabilities',
    low: 'Limited overlap with AI capabilities',
  },
  cta: {
    primary: 'See recommended actions',
    variants: ['View actions', 'What can I do?'],
  },
};

export const ROADMAP_COPY: RoadmapCopy = {
  headline: 'Actions that reduce exposure',
  subheadline:
    'These recommendations are specific to your task profile. Each one shifts work toward areas where human judgment remains essential.',
  actionPrefix: 'Action',
  impactLabel: 'Expected impact',
  cta: {
    primary: 'View summary',
    variants: ['Finish assessment', 'Complete'],
  },
};

export const SUMMARY_COPY: SummaryCopy = {
  headline: 'Assessment complete',
  subheadline: 'Your results are ready.',
  sections: {
    score: 'Overall exposure',
    highExposure: 'Highest exposure tasks',
    lowExposure: 'Lowest exposure tasks',
    topAction: 'Priority action',
  },
  download: 'Download report',
  nextSteps:
    'Review the recommended actions and consider how they apply to your current role.',
  cta: {
    primary: 'Download full report',
    variants: ['Save report', 'Export results'],
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getExposureBand(score: number): 'low' | 'moderate' | 'high' {
  if (score <= 30) return 'low';
  if (score <= 60) return 'moderate';
  return 'high';
}

export function getScoreMeaning(score: number): {
  label: string;
  meaning: string;
  action: string;
} {
  const band = getExposureBand(score);
  return {
    label: RISK_SCORE_COPY.bandLabels[band].label,
    meaning: RISK_SCORE_COPY.bandLabels[band].meaning,
    action: RISK_SCORE_COPY.bandLabels[band].action,
  };
}

export function getSignalStrengthExplanation(
  strength: 'low' | 'moderate' | 'high'
): string {
  const keyMap: Record<'low' | 'moderate' | 'high', 'Low' | 'Moderate' | 'High'> = {
    low: 'Low',
    moderate: 'Moderate',
    high: 'High',
  };
  return ASSESSMENT_JUSTIFICATION_COPY.sections.signalStrength.explanation[keyMap[strength]];
}
