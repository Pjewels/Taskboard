<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div
      class="rounded-2xl p-6 w-full max-w-md"
      :class="darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'"
    >
      <header class="flex justify-between items-center mb-4">
        <h2 id="modal-title" class="text-xl font-semibold">Edit Task</h2>
        <button
          @click="$emit('close')"
          aria-label="Close modal"
          class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
        >
          ✕
        </button>
      </header>

      <form @submit.prevent="save">
        <label class="block mb-2 font-semibold" for="title">Title</label>
        <input
          id="title"
          v-model="localTask.title"
          type="text"
          required
          class="w-full p-2 rounded border mb-4"
          :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
        />

        <label class="block mb-2 font-semibold" for="priority">Priority</label>
        <select
          id="priority"
          v-model="localTask.priority"
          class="w-full p-2 rounded border mb-4"
          :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label class="block mb-2 font-semibold" for="category">Category</label>
        <select
          id="category"
          v-model="localTask.category"
          class="w-full p-2 rounded border mb-4"
          :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
        >
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="other">Other</option>
        </select>

        <label class="block mb-2 font-semibold" for="dueDate">Due Date</label>
        <input
          id="dueDate"
          v-model="localTask.dueDate"
          type="date"
          class="w-full p-2 rounded border mb-4"
          :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
        />

        <label class="block mb-2 font-semibold" for="notes">Notes</label>
        <textarea
          id="notes"
          v-model="localTask.notes"
          rows="3"
          class="w-full p-2 rounded border mb-4 resize-none"
          :class="darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'"
        ></textarea>

        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded border"
            :class="darkMode ? 'border-gray-500 hover:border-gray-300 text-gray-400 hover:text-white' : 'border-gray-300 hover:border-gray-600 text-gray-700 hover:text-black'"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white transition"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, watch } from 'vue';
import type { Task } from '@/types';

export default defineComponent({
  name: 'TaskModal',
  props: {
    task: {
      type: Object as PropType<Task>,
      required: true,
    },
    darkMode: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const localTask = reactive({ ...props.task });

    watch(
      () => props.task,
      (newVal) => {
        Object.assign(localTask, newVal);
      }
    );

    const save = () => {
      emit('save', { ...localTask });
    };

    return { localTask, save };
  },
});
</script>
