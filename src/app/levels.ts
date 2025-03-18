export type Level = {
    id: number;
    question: string;
    nodes: string[];
    correctConnections: string[][][];
};

export const levels: Level[] = [
    {
        id: 1,
        question: "2 + 3 = ?",
        nodes: ["2", "+", "3", "=", "5"],
        correctConnections: [
            [['2', '+'], ['+', '3'], ['3', '='], ['=', '5']],
        ]
    },
    {
        id: 2,
        question: "5 x 2 = ?",
        nodes: ["5", "x", "2", "=", "10"],
        correctConnections: [
            [['5', 'x'], ['x', '2'], ['2', '='], ['=', '10']],
        ]
    },
    {
        id: 3,
        question: "10 - 4 = ?",
        nodes: ["10", "-", "4", "=", "6"],
        correctConnections: [
            [['10', '-'], ['-', '4'], ['4', '='], ['=', '6']],
        ]
    }
];

export const getRandomNodesOrder = (length: number): number[] => {
    const nodes = Array.from({length}, (_, i) => i + 1);
    for (let i = nodes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
    }
    return nodes;
}
