"use client";

import { useEffect, useRef } from "react";

interface Props {
  darkMode: boolean;
}

export default function AnimatedBackground({ darkMode }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const nodes = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    }));

    let clickEffect: { x: number; y: number; radius: number } | null = null;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const handleClick = (e: MouseEvent) => {
      clickEffect = {
        x: e.clientX,
        y: e.clientY,
        radius: 0,
      };
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("click", handleClick);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const lineColor = darkMode
        ? "rgba(0,255,120,0.30)"
        : "rgba(0,150,80,0.15)";

      const glowColor = darkMode
        ? "rgba(0,255,120,0.8)"
        : "rgba(0,120,60,0.8)";

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw node glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            // Click ripple gap
            if (clickEffect) {
              const gapDist = Math.sqrt(
                (nodes[i].x - clickEffect.x) ** 2 +
                  (nodes[i].y - clickEffect.y) ** 2
              );

              if (gapDist < clickEffect.radius) continue;
            }

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = lineColor;
            ctx.stroke();
          }
        }
      }

      if (clickEffect) {
        clickEffect.radius += 4;
        if (clickEffect.radius > 200) clickEffect = null;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", handleClick);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10"
    />
  );
}

