export class BaseWorker {

    constructor() {
        self.onmessage = this.handleMessage.bind(this);
        this.isProcessing = false;
        this.isInitializing = false;
        this.taskInstance = undefined;
    }

    async handleMessage(event) {
        const { type } = event.data;

        while (this.isProcessing) {
            await new Promise((resolve) => setTimeout(resolve, 10));
        }
        this.isProcessing = true;

        try {
            if (type == 'INIT') {
                console.log('Initializing the model in base worker!')
                await this.initializeBase(event.data);
                self.postMessage({ type: 'INIT_DONE' });
            }
            else if (type == 'CLEANUP') {
                if (this.taskInstance) {
                    this.taskInstance.close?.();
                    this.taskInstance = undefined;
                }
                self.postMessage({ type: 'CLEANUP_DONE'});
            }
            else {
                await this.handleCustomMessage(event.data)
            }
        }
        catch (error) {
            console.error("Worker error: ", error)
            self.postMessage({ type: 'WORKER_ERROR', error: error?.message || String (error)})
        }
        finally {
            this.isProcessing = false;
        }
    }

    async initializeBase(data) {
        if (this.isInitializing){
            return;
        }
        else {
            this.isInitializing = true;
        }

        try {
            if (this.taskInstance) {
                this.taskInstance.close?.();
                this.taskInstance = undefined;
            }
            await this.initializeTask(data);
        }
        finally {
            this.isInitializing = false;
        }
    }

    async initializeTask(data) {}
    async handleCustomMessage(data) {
        console.log('Cannot call handleCustomMessage from BaseWorker')
        throw new Error('handleCustomMessage')
    }
    detectStream(vidBitmap) {}
}

console.log('I am in BaseWorker file!')