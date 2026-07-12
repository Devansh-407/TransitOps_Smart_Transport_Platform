@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary-navy: #001f3f;
  --primary-dark-blue: #0052a3;
  --secondary-blue: #0066cc;
  --accent-orange: #ff9900;
  --bg-light: #f9fafb;
  --bg-white: #ffffff;
  --text-dark: #1f2937;
  --text-light: #6b7280;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--bg-light);
  color: var(--text-dark);
  line-height: 1.6;
}

@layer components {
  .container-app {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
  }

  .btn-secondary {
    @apply px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors;
  }

  .card {
    @apply bg-white rounded-lg shadow-soft p-6;
  }

  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
