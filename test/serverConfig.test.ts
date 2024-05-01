import { startServer } from '../src/server/serverConfig';
import express from 'express';

describe('Server Configuration', () => {
    let server: any

    beforeEach(async() => {
        const app = express();
        server = await startServer(app);
    });

    afterEach(() => {
        server.close();
    });

    it('should listen on port 4000 by default', async () => {
        expect(server.address().port).toEqual(4000);
    });
});
