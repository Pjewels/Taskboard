<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
    <!-- Header -->
    <header class="bg-indigo-700 text-white p-4 shadow-lg">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-3xl font-bold tracking-tight">TaskManager</h1>
        <div class="flex items-center space-x-6">
          <span class="text-sm font-medium">Welcome, {{ userName }}</span>
          <button @click="logout" class="bg-indigo-800 hover:bg-indigo-900 px-4 py-2 rounded-full transition duration-200">
            Logout
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto p-6 flex-grow">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Task Input -->
        <div class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4"> New Task</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              v-model="newTask.title" 
              type="text" 
              placeholder="Task Title" 
              class="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
            <select 
              v-model="newTask.priority" 
              class="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select 
              v-model="newTask.category" 
              class="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </select>
            <input 
              v-model="newTask.dueDate" 
              type="date" 
              class="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
            <button 
              @click="addTask" 
              :disabled="!newTask.title" 
              class="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 disabled:bg-gray-400 transition duration-200"
            >
              Add Task
            </button>
          </div>
        </div>

        <!-- Task Filters and Sorting -->
        <div class="mb-8 flex flex-wrap gap-4">
          <div class="flex space-x-2">
            <button 
              v-for="f in filters" 
              :key="f.value" 
              @click="filter = f.value" 
              :class="{'bg-indigo-600 text-white': filter === f.value, 'bg-gray-200 text-gray-700': filter !== f.value}" 
              class="px-4 py-2 rounded-full transition duration-200"
            >
              {{ f.label }}
            </button>
          </div>
          <select 
            v-model="sortBy" 
            class="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="priority">Sort by Priority</option>
            <option value="dueDate">Sort by Due Date</option>
          </select>
        </div>

        <!-- Task List -->
        <div class="space-y-4">
          <div 
            v-for="task in filteredTasks" 
            :key="task.id" 
            class="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition duration-200"
          >
            <div class="flex items-center space-x-4">
              <input 
                type="checkbox" 
                v-model="task.completed" 
                @change="toggleTask(task.id)" 
                class="h-5 w-5 text-indigo-600 rounded"
              >
              <div>
                <h3 :class="{'line-through text-gray-500': task.completed}" class="font-medium text-gray-800">
                  {{ task.title }}
                </h3>
                <div class="text-sm space-x-2">
                  <span 
                    :class="{
                      'text-green-500': task.priority === 'low',
                      'text-yellow-500': task.priority === 'medium',
                      'text-red-500': task.priority === 'high'
                    }"
                  >
                    Priority: {{ task.priority }}
                  </span>
                  <span class="text-gray-500">Category: {{ task.category }}</span>
                  <span v-if="task.dueDate" class="text-gray-500">Due: {{ formatDate(task.dueDate) }}</span>
                </div>
              </div>
            </div>
            <button 
              @click="deleteTask(task.id)" 
              class="text-red-500 hover:text-red-700 transition duration-200"
            >
              Delete
            </button>
          </div>
          <p v-if="!filteredTasks.length" class="text-gray-500 text-center">No tasks available.</p>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-indigo-800 text-white p-4">
      <div class="container mx-auto text-center">
        <p>© 2025 Priceless. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Task, NewTask } from './types';

export default defineComponent({
  name: 'App',
  data() {
    return {
      tasks: [] as Task[],
      newTask: { title: '', priority: 'medium', category: 'work', dueDate: '' } as NewTask,
      filter: 'all',
      sortBy: 'priority',
      userName: 'User',
      filters: [
        { label: 'All', value: 'all' },
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
      ],
    };
  },
  computed: {
    filteredTasks(): Task[] {
      let filtered = this.tasks;
      if (this.filter === 'pending') {
        filtered = filtered.filter(task => !task.completed);
      } else if (this.filter === 'completed') {
        filtered = filtered.filter(task => task.completed);
      }
      return filtered.sort((a, b) => {
        if (this.sortBy === 'priority') {
          const priorities = { high: 3, medium: 2, low: 1 };
          return priorities[b.priority] - priorities[a.priority];
        } else {
          return (a.dueDate || '9999-12-31').localeCompare(b.dueDate || '9999-12-31');
        }
      });
    },
  },
  methods: {
    addTask() {
      if (this.newTask.title) {
        this.tasks.push({
          id: Date.now(),
          title: this.newTask.title,
          priority: this.newTask.priority,
          category: this.newTask.category,
          dueDate: this.newTask.dueDate,
          completed: false,
        });
        this.newTask = { title: '', priority: 'medium', category: 'work', dueDate: '' };
        this.saveTasks();
      }
    },
    toggleTask(id: number) {
      const task = this.tasks.find(task => task.id === id);
      if (task) {
        task.completed = !task.completed;
        this.saveTasks();
      }
    },
    deleteTask(id: number) {
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.saveTasks();
    },
    logout() {
      alert('Logged out!');
    },
    saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    loadTasks() {
      const saved = localStorage.getItem('tasks');
      if (saved) {
        this.tasks = JSON.parse(saved);
      }
    },
    formatDate(date: string): string {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
  },
  mounted() {
    this.loadTasks();
  },
});
</script>