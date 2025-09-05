<template>
    <nav v-if="totalPages > 1"
        class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
            <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                :class="['relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50', { 'cursor-not-allowed opacity-50': currentPage === 1 }]">
                Anterior
            </button>
            <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                :class="['relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50', { 'cursor-not-allowed opacity-50': currentPage === totalPages }]">
                Siguiente
            </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
                <p class="text-sm text-gray-700">
                    Mostrando
                    <span class="font-medium">{{ (currentPage - 1) * limit + 1 }}</span>
                    hasta
                    <span class="font-medium">{{ Math.min(currentPage * limit, totalItems) }}</span>
                    de
                    <span class="font-medium">{{ totalItems }}</span>
                    resultados
                </p>
            </div>
            <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        :class="['relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0', { 'cursor-not-allowed opacity-50': currentPage === 1 }]">
                        <span class="sr-only">Previous</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd"
                                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>

                    <div v-for="page in pages" :key="page">
                        <button v-if="page === '...'" disabled
                            class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                            ...
                        </button>
                        <button v-else @click="changePage(page)" :class="['relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0', {
                            'bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600': page === currentPage,
                            'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50': page !== currentPage,
                        }]">
                            {{ page }}
                        </button>
                    </div>

                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                        :class="['relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0', { 'cursor-not-allowed opacity-50': currentPage === totalPages }]">
                        <span class="sr-only">Next</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd"
                                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                clip-rule="evenodd" />
                        </svg>
                    </button>
                </nav>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    currentPage: {
        type: Number,
        required: true,
    },
    totalItems: {
        type: Number,
        required: true,
    },
    limit: {
        type: Number,
        default: 10,
    },
});

const emit = defineEmits(['page-changed']);

const totalPages = computed(() => Math.ceil(props.totalItems / props.limit));

const pages = computed(() => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, props.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages.value, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
            pageNumbers.push('...');
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (endPage < totalPages.value) {
        if (endPage < totalPages.value - 1) {
            pageNumbers.push('...');
        }
        pageNumbers.push(totalPages.value);
    }

    return pageNumbers;
});

const changePage = (page) => {
    if (page > 0 && page <= totalPages.value) {
        emit('page-changed', page);
    }
};
</script>