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

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, RoadmapAction } from '../../app.component';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  @Input() riskScore: number = 0;
  @Input() tasks: Task[] = [];
  @Input() topAction: RoadmapAction | undefined;

  get scoreColorClass(): string {
    if (this.riskScore <= 30) return 'summary__score--low';
    if (this.riskScore <= 60) return 'summary__score--medium';
    return 'summary__score--high';
  }

  get highExposureTasks(): Task[] {
    return this.tasks.filter((t) => t.exposure === 'high');
  }

  get lowExposureTasks(): Task[] {
    return this.tasks.filter((t) => t.exposure === 'low');
  }

  downloadReport(): void {
    // Mock implementation - in production this would generate a PDF
    const reportContent = this.generateReportText();
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taskexposure-report.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private generateReportText(): string {
    let report = 'TASKEXPOSURE Assessment Report\n';
    report += '================================\n\n';
    report += `Risk Score: ${this.riskScore}%\n\n`;

    report += 'Highest Exposure Tasks:\n';
    this.highExposureTasks.forEach((t) => {
      report += `- ${t.description}\n`;
    });
    report += '\n';

    report += 'Lowest Exposure Tasks:\n';
    this.lowExposureTasks.forEach((t) => {
      report += `- ${t.description}\n`;
    });
    report += '\n';

    if (this.topAction) {
      report += 'Top Recommended Action:\n';
      report += `${this.topAction.description}\n`;
      report += `${this.topAction.explanation}\n`;
    }

    return report;
  }
}
