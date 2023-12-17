export interface ICategory {
    id: string | null;
    name: string;
    color: string;
    index: number;
}

export interface ITask {
    id: string | null;
    name: string;
    categoryId: string;
    index?: number;
    isCompleted: boolean;
    matrix: number;
    createdAt: number;
}