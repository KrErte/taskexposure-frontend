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

import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HumanSignature, HUMAN_DIMENSIONS } from '../../shared/models/uncloneable.model';

@Component({
  selector: 'app-human-signature',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="signature-container" [class.signature-container--pulsing]="animate">
      <canvas
        #signatureCanvas
        class="signature-canvas"
        [width]="size"
        [height]="size"
      ></canvas>
      <div class="signature-glow"></div>
      <div class="signature-label">{{ label }}</div>
    </div>
  `,
  styles: [`
    .signature-container {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      &--pulsing {
        .signature-canvas {
          animation: pulse-signature 3s ease-in-out infinite;
        }

        .signature-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      }
    }

    .signature-canvas {
      position: relative;
      z-index: 2;
      border-radius: 50%;
    }

    .signature-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      height: 80%;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(20px);
      z-index: 1;
    }

    .signature-label {
      position: absolute;
      bottom: -1.5rem;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      white-space: nowrap;
    }

    @keyframes pulse-signature {
      0%, 100% {
        transform: scale(1);
        filter: brightness(1);
      }
      50% {
        transform: scale(1.02);
        filter: brightness(1.1);
      }
    }

    @keyframes pulse-glow {
      0%, 100% {
        opacity: 0.5;
        transform: translate(-50%, -50%) scale(1);
      }
      50% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(1.1);
      }
    }
  `],
})
export class HumanSignatureComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('signatureCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input() signature!: HumanSignature;
  @Input() size = 200;
  @Input() animate = true;
  @Input() label = 'Your Signature';

  private ctx!: CanvasRenderingContext2D;
  private animationFrame: number | null = null;
  private rotationAngle = 0;

  ngAfterViewInit(): void {
    this.initCanvas();
    this.drawSignature();
    if (this.animate) {
      this.startAnimation();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['signature'] && !changes['signature'].firstChange) {
      this.drawSignature();
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
  }

  private startAnimation(): void {
    const animate = () => {
      this.rotationAngle += 0.002;
      this.drawSignature();
      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  private drawSignature(): void {
    if (!this.ctx || !this.signature) return;

    const ctx = this.ctx;
    const size = this.size;
    const center = size / 2;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(center, center, size * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(22, 27, 34, 0.8)';
    ctx.fill();

    // Draw outer ring
    ctx.beginPath();
    ctx.arc(center, center, size * 0.45, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw signature points and connections
    const points = this.signature.points;
    const primaryColor = this.signature.dominantColor;
    const secondaryColor = this.signature.secondaryColor;

    // Draw connecting lines
    ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const x = point.x * size;
      const y = point.y * size;

      // Apply subtle rotation
      const rotatedX = center + (x - center) * Math.cos(this.rotationAngle) - (y - center) * Math.sin(this.rotationAngle);
      const rotatedY = center + (x - center) * Math.sin(this.rotationAngle) + (y - center) * Math.cos(this.rotationAngle);

      if (i === 0) {
        ctx.moveTo(rotatedX, rotatedY);
      } else {
        ctx.lineTo(rotatedX, rotatedY);
      }
    }
    ctx.closePath();

    // Create gradient for the signature shape
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, size * 0.4);
    gradient.addColorStop(0, primaryColor + '40');
    gradient.addColorStop(0.5, secondaryColor + '30');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = primaryColor + '80';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw glowing points at key positions
    for (let i = 0; i < points.length; i += 3) {
      const point = points[i];
      const x = point.x * size;
      const y = point.y * size;

      const rotatedX = center + (x - center) * Math.cos(this.rotationAngle) - (y - center) * Math.sin(this.rotationAngle);
      const rotatedY = center + (x - center) * Math.sin(this.rotationAngle) + (y - center) * Math.cos(this.rotationAngle);

      // Get dimension color
      const dimColor = HUMAN_DIMENSIONS[point.dimension].color;

      // Glow effect
      const glowGradient = ctx.createRadialGradient(rotatedX, rotatedY, 0, rotatedX, rotatedY, 8 * point.intensity);
      glowGradient.addColorStop(0, dimColor);
      glowGradient.addColorStop(0.5, dimColor + '60');
      glowGradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(rotatedX, rotatedY, 8 * point.intensity, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Core point
      ctx.beginPath();
      ctx.arc(rotatedX, rotatedY, 2 * point.intensity, 0, Math.PI * 2);
      ctx.fillStyle = dimColor;
      ctx.fill();
    }

    // Draw center emblem
    const centerGradient = ctx.createRadialGradient(center, center, 0, center, center, 15);
    centerGradient.addColorStop(0, '#ffffff');
    centerGradient.addColorStop(0.3, primaryColor);
    centerGradient.addColorStop(1, secondaryColor + '40');

    ctx.beginPath();
    ctx.arc(center, center, 12, 0, Math.PI * 2);
    ctx.fillStyle = centerGradient;
    ctx.fill();

    // Inner detail
    ctx.beginPath();
    ctx.arc(center, center, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
}
