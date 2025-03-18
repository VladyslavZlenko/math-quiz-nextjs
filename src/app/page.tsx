'use client';

import {useState, useEffect, useRef, RefObject} from "react";
import Drawflow, {DrawflowConnectionDetail, DrawflowNode} from "drawflow";
import {getRandomNodesOrder, Level, levels} from "@/app/levels";

export default function HomePage() {
  const editorRef: RefObject<Drawflow | null> = useRef<Drawflow | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentLevel, setCurrentLevel] = useState<number>(0);

  useEffect((): void => {
    const container = document.getElementById("drawflow");
    if (!editorRef.current && container) {
      editorRef.current = new Drawflow(container);
      editorRef.current.start();
    }
    loadLevel(currentLevel);
  }, [currentLevel]);

  const loadLevel = (levelIndex: number): void => {
    if (!editorRef.current) return;
    editorRef.current.clear();

    const level: Level = levels[levelIndex];
    const nodesOrder: number[] = getRandomNodesOrder(level.nodes.length);
    const {innerWidth, innerHeight} = window;

    level.nodes.forEach((node: string, index: number) => {
      const x: number = innerWidth / 2 - 75;
      const y: number = (innerHeight / 5) + nodesOrder[index] * 100;
      editorRef.current?.addNode(node, 1, 1, x, y, 'node', {}, node, false);
    });
  };

  const checkSolution = (): void => {
    if (!editorRef.current) return;
    const data = editorRef.current.export();

    const connections: { [nodeKey: string]: DrawflowNode } = data.drawflow.Home.data || {};
    const userConnections: string[][] = [];

    Object.values(connections).forEach((node: DrawflowNode): void => {
      node.outputs.output_1.connections.forEach((connection: DrawflowConnectionDetail) => {
        userConnections.push([node.name, connections[connection.node].name]);
      });
    });

    const correctConnections: string[][][] = levels[currentLevel].correctConnections;
    const isCorrectAnswer: boolean = correctConnections.some(
        (correctSet: string[][]) => JSON.stringify(correctSet) === JSON.stringify(userConnections)
    );
    setIsCorrect(isCorrectAnswer);
  };

  const nextLevel = (): void => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setIsCorrect(null);
    }
  };

  return (
      <>
        <div className="relative flex z-50 w-full flex-col justify-between items-center p-8 space-y-4">
          <h1 className="text-3xl md:text-5xl font-bold text-center">Math Quiz - Level {levels[currentLevel].id}</h1>
          <h2 className='text-2xl md:text-4xl font-bold text-center'>{levels[currentLevel].question}</h2>
          {isCorrect && (
              <>
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={nextLevel}
                >
                  Next Level
                </button>
                <p className="text-xl md:text-3xl font-bold text-green-500 text-center">Correct Answer!</p>
              </>
          )}
          {!isCorrect && (
              <>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer font-bold"
                    onClick={checkSolution}
                >
                  Check Answer
                </button>
                {isCorrect === false &&(<p className="text-xl md:text-3xl font-bold text-red-500 text-center">Incorrect Answer</p>)}
              </>
          )}
        </div>
        <div id="drawflow" className="absolute top-0 bottom-0 left-0 right-0 border border-gray-300"></div>
      </>
  );
}
