<template>
  <div :class="darkMode ? 'bg-gray-900 text-white min-h-screen' : 'bg-white text-gray-900 min-h-screen'">
    <header class="p-4 flex justify-between items-center border-b" :class="darkMode ? 'border-gray-700' : 'border-gray-200'">
      <h1 class="text-3xl font-bold">Task Manager </h1>
      <button
        @click="toggleDarkMode"
        class="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition"
        aria-label="Toggle Dark Mode"
      >
        {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
      </button>
    </header>

    <main class="p-6 max-w-4xl mx-auto">
      <!-- Add Task Button -->
      <div class="flex justify-between items-center mb-6">
        <input
          v-model="newTaskTitle"
          @keyup.enter="addTask"
          placeholder="Add a new task and press Enter"
          class="flex-grow p-3 border rounded-xl mr-4"
          :class="darkMode ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'"
        />
        <button
          @click="addTask"
          class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-400 transition"
          :disabled="!newTaskTitle.trim()"
        >
          Add
        </button>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-6">
        <select v-model="filters.priority" class="p-2 rounded border" :class="darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'">
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select v-model="filters.category" class="p-2 rounded border" :class="darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'">
          <option value="">All Categories</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="other">Other</option>
        </select>

        <select v-model="filters.status" class="p-2 rounded border" :class="darkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'">
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <!-- Task List -->
      <ul>
        <li
          v-for="task in filteredTasks"
          :key="task.id"
          class="flex justify-between items-center p-4 mb-3 rounded-xl border cursor-pointer"
          :class="[
            darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100',
            task.completed ? (darkMode ? 'bg-green-900' : 'bg-green-100') : ''
          ]"
          @click="editTask(task)"
          tabindex="0"
          @keyup.enter="editTask(task)"
          role="button"
          :aria-pressed="task.completed"
        >
          <div>
            <input
              type="checkbox"
              v-model="task.completed"
              @click.stop
              class="mr-3 cursor-pointer"
              :aria-label="'Mark task ' + task.title + (task.completed ? ' as incomplete' : ' as complete')"
            />
            <span :class="task.completed ? 'line-through opacity-70' : ''">{{ task.title }}</span>
          </div>

          <div class="flex items-center space-x-3 text-sm">
            <span
              class="px-3 py-1 rounded-full font-semibold uppercase tracking-wide"
              :class="priorityColors[task.priority]"
            >
              {{ task.priority }}
            </span>
            <span
              class="px-3 py-1 rounded-full bg-indigo-200 text-indigo-800 font-semibold uppercase tracking-wide"
              v-if="task.category"
            >
              {{ task.category }}
            </span>
            <span class="text-gray-400" v-if="task.dueDate">
              Due {{ formatDate(task.dueDate) }}
            </span>
          </div>
        </li>
      </ul>

      <!-- Edit Task Modal -->
      <TaskModal
        v-if="editingTask"
        :task="editingTask"
        :darkMode="darkMode"
        @close="closeModal"
        @save="saveTask"
      />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import TaskModal from '@/components/TaskModal.vue';
import type { Task } from '@/types';

export default defineComponent({
  name: 'App',
  components: { TaskModal },
  setup() {
    const darkMode = ref(localStorage.getItem('darkMode') === 'true');

    const toggleDarkMode = () => {
      darkMode.value = !darkMode.value;
      localStorage.setItem('darkMode', darkMode.value.toString());
    };

    const tasks = ref<Task[]>([
      // Initial sample task
      {
        id: 1,
        title: 'Welcome to TaskMaster!',
        priority: 'medium',
        category: 'work',
        dueDate: '',
        notes: 'Click to edit or add new tasks above.',
        completed: false,
      },
    ]);

    const newTaskTitle = ref('');
    const editingTask = ref<Task | null>(null);

    const filters = ref({
      priority: '',
      category: '',
      status: '',
    });

    const priorityColors = {
      low: darkMode.value ? 'bg-green-700 text-green-100' : 'bg-green-200 text-green-900',
      medium: darkMode.value ? 'bg-yellow-700 text-yellow-100' : 'bg-yellow-200 text-yellow-900',
      high: darkMode.value ? 'bg-red-700 text-red-100' : 'bg-red-200 text-red-900',
    };

    const filteredTasks = computed(() => {
      return tasks.value.filter((task) => {
        const matchesPriority = filters.value.priority ? task.priority === filters.value.priority : true;
        const matchesCategory = filters.value.category ? task.category === filters.value.category : true;
        const matchesStatus =
          filters.value.status === 'completed'
            ? task.completed
            : filters.value.status === 'pending'
            ? !task.completed
            : true;
        return matchesPriority && matchesCategory && matchesStatus;
      });
    });

    function addTask() {
      if (!newTaskTitle.value.trim()) return;
      tasks.value.push({
        id: Date.now(),
        title: newTaskTitle.value.trim(),
        priority: 'low',
        category: 'work',
        dueDate: '',
        notes: '',
        completed: false,
      });
      newTaskTitle.value = '';
    }

    function editTask(task: Task) {
      editingTask.value = { ...task };
    }

    function closeModal() {
      editingTask.value = null;
    }

    function saveTask(updatedTask: Task) {
      const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
      if (index !== -1) {
        tasks.value[index] = { ...updatedTask };
      }
      editingTask.value = null;
    }

    function formatDate(dateStr: string) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }

    return {
      darkMode,
      toggleDarkMode,
      tasks,
      newTaskTitle,
      editingTask,
      filters,
      priorityColors,
      filteredTasks,
      addTask,
      editTask,
      closeModal,
      saveTask,
      formatDate,
    };
  },
});
</script>
