"use client";

import { useEffect, useRef, useState } from "react";
import { Rocket, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Asteroid = {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
};

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const keysRef = useRef<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [nearMiss, setNearMiss] = useState(false);

  const shipRef = useRef({ x: 0, width: 40, height: 20 });
  const asteroidsRef = useRef<Asteroid[]>([]);
  const starsRef = useRef<{ x: number; y: number; speed: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      shipRef.current.x = canvas.width / 2 - shipRef.current.width / 2;

      starsRef.current = Array.from({ length: 200 }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.5 + Math.random() * 1.5,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const spawnAsteroid = () => {
      const size = 20 + Math.random() * 30;
      asteroidsRef.current.push({
        id: crypto.randomUUID(),
        x: Math.random() * (canvas.width - size),
        y: -size,
        size,
        speed: 2 + Math.random() * 3,
      });
    };

    let lastSpawn = 0;

    const loop = (time: number) => {
      if (gameOver) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Starfield
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      starsRef.current.forEach((star) => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        ctx.fillRect(star.x, star.y, 2, 2);
      });

      // Ship movement
      if (keysRef.current.left) shipRef.current.x -= 6;
      if (keysRef.current.right) shipRef.current.x += 6;

      shipRef.current.x = Math.max(
        0,
        Math.min(canvas.width - shipRef.current.width, shipRef.current.x)
      );

      const shipY = canvas.height - 100;

      // Draw ship
      ctx.fillStyle = "#ff2fae";
      ctx.fillRect(
        shipRef.current.x,
        shipY,
        shipRef.current.width,
        shipRef.current.height
      );

      // Spawn asteroids
      if (time - lastSpawn > 550) {
        spawnAsteroid();
        lastSpawn = time;
      }

      // Asteroids
      asteroidsRef.current.forEach((a) => {
        a.y += a.speed;
        ctx.fillStyle = "#00f5d4";
        ctx.beginPath();
        ctx.arc(a.x + a.size / 2, a.y + a.size / 2, a.size / 2, 0, Math.PI * 2);
        ctx.fill();

        const collision =
          a.x < shipRef.current.x + shipRef.current.width &&
          a.x + a.size > shipRef.current.x &&
          a.y < shipY + shipRef.current.height &&
          a.y + a.size > shipY;

        if (collision) {
          setGameOver(true);
        }

        const near =
          !collision &&
          a.y + a.size > shipY - 20 &&
          a.y < shipY + shipRef.current.height + 20 &&
          Math.abs(a.x - shipRef.current.x) < 80;

        if (near) {
          setNearMiss(true);
          setTimeout(() => setNearMiss(false), 120);
        }
      });

      asteroidsRef.current = asteroidsRef.current.filter(
        (a) => a.y < canvas.height + 80
      );

      setScore((s) => s + 1);

      animationRef.current = requestAnimationFrame(loop);
    };

    animationRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [gameOver]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keysRef.current.left = true;
      if (e.key === "ArrowRight") keysRef.current.right = true;
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keysRef.current.left = false;
      if (e.key === "ArrowRight") keysRef.current.right = false;
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  const restart = () => {
    asteroidsRef.current = [];
    setScore(0);
    setGameOver(false);
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="p-6 flex items-center justify-between">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Neon Noir
        </h1>
        <div className="flex items-center gap-4">
          <Rocket className="text-primary" aria-hidden="true" />
          <span className="text-lg font-semibold">Score: {score}</span>
        </div>
      </header>

      {/* Force the gameplay area to truly fill remaining viewport height */}
      <section className="flex-1 flex flex-col px-4 pb-8 min-h-0">
        <div className="relative flex-1 min-h-0 w-full rounded-lg border border-border bg-card overflow-hidden">
          <canvas
            ref={canvasRef}
            className={`block w-full h-full ${nearMiss ? "opacity-80" : "opacity-100"}`}
          />

          {gameOver && (
            <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center gap-6 text-center p-8">
              <h2 className="text-5xl font-bold text-destructive">
                Collision
              </h2>
              <p className="text-muted-foreground">
                You drifted too close to the void.
              </p>
              <Button
                onClick={restart}
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restart Run
              </Button>
            </div>
          )}
        </div>
      </section>

      <footer className="p-6 text-sm text-muted-foreground flex justify-between">
        <span>Use ← and → to steer</span>
        <span>Dodge. Survive. Repeat.</span>
      </footer>
    </main>
  );
}
