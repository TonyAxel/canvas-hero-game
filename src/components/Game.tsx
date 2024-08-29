import React, {MouseEvent, useEffect, useRef, useState} from 'react';
import Hero from "./Hero";
import Bullet from "./Bullet";
import './style.scss'

const Game = () => {
    const ref = useRef<HTMLCanvasElement>(null);
    const [heroes, setHeroes] = useState<Hero[]>([])
    const [selectedHero, setSelectedHero] = useState<Hero | null>(null);

    //create Heroes
    useEffect(() => {
        if (!ref.current) return;
        const canvas = ref.current;
        const context = canvas.getContext("2d");
        if (!context) return;
        setHeroes(
            [
                new Hero(context, {x: 50, y: 400}, '#ff0000', 0, 1),
                new Hero(context, {x: 750, y: 400}, '#0000ff', 0, -1)
            ]
        )
    }, [])

    //update hit
    const updateHitCount = (heroColor: string) => {
        setHeroes(prevHeroes =>
            prevHeroes.map(hero => {
                    if (hero.color === heroColor)
                    {
                        hero.hit += 1
                        return hero;
                    }
                    return hero;
                }
            )
        );
    };

    //show hero and bullets
    useEffect(() => {
        if (!ref.current) return;
        const canvas = ref.current;
        const context = canvas.getContext("2d");
        if (!context) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        let id: number;
        const draw = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            heroes.forEach((hero, index) => {
                if (hero.location.y <= 20 || hero.location.y >= canvas.height - 20) {
                    hero.speed *= -1
                }
                const otherHero = heroes.find((hero, indexOther) => index !== indexOther);
                if (otherHero) {
                    let newBullets: Bullet[] = []
                    hero.bullets.forEach((bullet, index) => {
                        const distance = Math.sqrt((bullet.location.x - otherHero.location.x) ** 2 + (bullet.location.y - otherHero.location.y) ** 2);
                        const isWithinCanvas = bullet.location.x >= 0 &&
                            bullet.location.x <= canvas.width
                        if (distance < hero.radius + bullet.radius) {
                            updateHitCount(otherHero.color)
                            return;
                        } else if (isWithinCanvas) {
                            newBullets.push(bullet);
                        }
                    })
                    hero.bullets = newBullets
                }
                hero.location = {x: hero.location.x, y: hero.location.y + hero.speed};
                hero.show()
            })

            id = requestAnimationFrame(draw);
        }
        draw()
        return () => {
            cancelAnimationFrame(id);
        }
    }, [heroes]);

    //shoot frequency
    useEffect(() => {
        const intervals: NodeJS.Timeout[] = heroes.map((hero) => {
            return setInterval(() => {
                hero.shot();
            }, hero.shootFrequency);
        });

        return () => {
            intervals.forEach(clearInterval);
        };
    }, [heroes]);

    //tap to show hero settings
    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!ref.current) return;
        const canvas = ref.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const clickedHero = heroes.find(
            (hero) =>
                Math.sqrt((x - hero.location.x) ** 2 + (y - hero.location.y) ** 2) <
                hero.radius
        );

        if (clickedHero) {
            setSelectedHero(clickedHero);
        } else {
            setSelectedHero(null);
        }
    };

    //update hero
    const updateHeroSettings = (key: string, value: number | string) => {
        setHeroes((prevHeroes) => prevHeroes.map((hero) => {
                    if (hero.color === selectedHero?.color) {
                        (hero as any)[key] = value;
                    }
                    return hero;
                }
            )
        );
    };

    const handleMouseMove = (e: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => {
        if (!ref.current) return;
        const canvas = ref.current;
        const context = canvas.getContext("2d");
        if (!context) return;
        const rect = ref.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const heroUnderMouse = heroes.find(hero => {
            const distance = Math.sqrt((mouseX - hero.location.x) ** 2 + (mouseY - hero.location.y) ** 2);
            return distance < hero.radius;
        });
        if (!heroUnderMouse) return;
        // context.clearRect(0, 0, canvas.width, canvas.height);
        const isTopHalf = mouseY < heroUnderMouse.location.y;
        setHeroes((prevHeroes) =>
            prevHeroes.map((hero) => {
                if (hero === heroUnderMouse) {
                    hero.speed = isTopHalf ? hero.speed < 0 ? hero.speed * -1 : hero.speed : hero.speed > 0 ? hero.speed * -1 : hero.speed;
                }
                return hero;
            })
        );
    }


    return (
        <div className="App">
            <div className="scoreboard">
                <div className="hero-score">
                    <div className="hero-header red-hero">Red Hero</div>
                    <div className="score" id="red-score">{heroes[0]?.hit ?? 0}</div>
                </div>
                <div className="hero-score">
                    <div className="hero-header blue-hero">Blue Hero</div>
                    <div className="score" id="blue-score">{heroes[1]?.hit ?? 0}</div>
                </div>
            </div>
            <canvas id='canvas' ref={ref} width={800} height={800} onMouseMoveCapture={handleMouseMove} onClick={handleCanvasClick}></canvas>
            {selectedHero && (
                <div className="menu">
                    <h3>Настройки {selectedHero.color} героя</h3>
                    <label>
                        Цвет пуль:
                        <input
                            type="color"
                            value={selectedHero.bulletColor}
                            onChange={(e) =>
                                updateHeroSettings('bulletColor', e.target.value)
                            }
                        />
                    </label>
                    <label>
                        Темп стрельбы:
                        <input
                            type="range"
                            min="100"
                            max="2000"
                            value={selectedHero.shootFrequency}
                            onChange={(e) =>
                                updateHeroSettings('shootFrequency', Number(e.target.value))
                            }
                        />
                    </label>
                    <label>
                        Скорость героя:
                        <input
                            type="range"
                            min="0"
                            max="20"
                            value={selectedHero.speed < 0 ? selectedHero.speed * -1 : selectedHero.speed}
                            onChange={(e) =>
                                updateHeroSettings('speed', Number(e.target.value))
                            }
                        />
                    </label>
                </div>
            )}
        </div>
    );
};

export default Game;
