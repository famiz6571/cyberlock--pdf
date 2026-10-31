import React, { useEffect, useRef } from 'react';

interface MatrixBackgroundProps {
  glitchActive?: boolean;
}

interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  pulsePhase: number;
}

interface DataPacket {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

export const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ glitchActive = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNetwork();
    };
    window.addEventListener('resize', onResize);

    // Mouse coordinates for subtle interactive node tension
    const mouse = { x: -1000, y: -1000, active: false };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    let nodes: NeuralNode[] = [];
    let packets: DataPacket[] = [];
    const maxConnectionDist = 140;

    const initNetwork = () => {
      const count = Math.min(85, Math.floor((width * height) / 16000));
      nodes = [];
      packets = [];

      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 1.8 + 1.2;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55,
          radius,
          baseRadius: radius,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };
    initNetwork();

    let frame = 0;

    const render = () => {
      frame++;
      // Deep cyber background with subtle trailing
      ctx.fillStyle = 'rgba(3, 6, 11, 0.28)';
      ctx.fillRect(0, 0, width, height);

      // Randomly spawn data packets across connected nodes
      if (frame % 8 === 0 && packets.length < 24) {
        const n1Idx = Math.floor(Math.random() * nodes.length);
        // Find a nearby neighbor
        for (let j = 0; j < nodes.length; j++) {
          if (n1Idx === j) continue;
          const dx = nodes[n1Idx].x - nodes[j].x;
          const dy = nodes[n1Idx].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxConnectionDist) {
            packets.push({
              fromNode: n1Idx,
              toNode: j,
              progress: 0,
              speed: 0.02 + Math.random() * 0.025,
              color: Math.random() > 0.4 ? '#00f0ff' : '#00ff9d',
            });
            break;
          }
        }
      }

      // Update and draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];

        node.x += node.vx;
        node.y += node.vy;

        // Bounce on boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Mouse interaction
        if (mouse.active) {
          const mdx = node.x - mouse.x;
          const mdy = node.y - mouse.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 120 && mDist > 0) {
            const force = (120 - mDist) / 120;
            node.x += (mdx / mDist) * force * 1.5;
            node.y += (mdy / mDist) * force * 1.5;
          }
        }

        node.pulsePhase += 0.03;
        const currentRadius = node.baseRadius + Math.sin(node.pulsePhase) * 0.6;

        // Glowing node core
        ctx.fillStyle = i % 4 === 0 ? 'rgba(0, 255, 157, 0.85)' : 'rgba(0, 240, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fill();

        // Subtle outer glow halo for key nodes
        if (i % 3 === 0) {
          ctx.fillStyle = i % 4 === 0 ? 'rgba(0, 255, 157, 0.15)' : 'rgba(0, 240, 255, 0.15)';
          ctx.beginPath();
          ctx.arc(node.x, node.y, currentRadius * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDist) {
            const alpha = (1 - dist / maxConnectionDist) * 0.22;
            ctx.strokeStyle = i % 2 === 0 ? `rgba(0, 240, 255, ${alpha})` : `rgba(0, 255, 157, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }

      // Render data packets traveling across network edges
      for (let p = packets.length - 1; p >= 0; p--) {
        const pkt = packets[p];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          packets.splice(p, 1);
          continue;
        }

        const from = nodes[pkt.fromNode];
        const to = nodes[pkt.toNode];
        if (!from || !to) {
          packets.splice(p, 1);
          continue;
        }

        const px = from.x + (to.x - from.x) * pkt.progress;
        const py = from.y + (to.y - from.y) * pkt.progress;

        ctx.fillStyle = pkt.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = pkt.color;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Glitch flash artifact during intense encryption
      if (glitchActive && Math.random() > 0.7) {
        ctx.fillStyle = 'rgba(0, 240, 255, 0.06)';
        ctx.fillRect(0, Math.random() * height, width, Math.random() * 12 + 3);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [glitchActive]);

  return <canvas ref={canvasRef} className="cyber-canvas-bg" />;
};
