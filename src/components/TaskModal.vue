<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Edit Task</h2>
      <div class="space-y-4">
        <input 
          v-model="localTask.title" 
          type="text" 
          placeholder="Task Title" 
          class="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
        <select 
          v-model="localTask.priority" 
          class="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select 
          v-model="localTask.category" 
          class="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="other">Other</option>
        </select>
        <input 
          v-model="localTask.dueDate" 
          type="date" 
          class="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
        <textarea
          v-model="localTask.notes"
          placeholder="Task Notes"
          class="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows="4"
        ></textarea>
      </div>
      <div class="mt-6 flex justify-end space-x-2">
        <button 
          @click="$emit('close')" 
          class="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition duration-200"
        >
          Cancel
        </button>
        <button 
          @click="$emit('save', localTask)" 
          :disabled="!localTask.title" 
          class="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 disabled:bg-gray-400 transition duration-200"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Task } from '../types';

export default defineComponent({
  name: 'TaskModal',
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },
  },
  data() {
    return {
      localTask: { ...this.task } as Task,
    };
  },
});
</script>