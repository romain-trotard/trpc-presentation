import { defineConfig } from "cypress";
import resetDb from './cypress/tasks/resetDb';

export default defineConfig({
    e2e: {
        setupNodeEvents(on, _config) {
            on('task', {
                resetDb
            })
        },
    },
});

