export interface Task {
  id: number;
  title: string;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'other' | '';
  dueDate: string;
  notes: string;
  completed: boolean;
}
