const { aiDetection } = require('./index');


describe('AI Detection', () => {
    it('should return a valid response for a known question', async () => {
        const question = "Tell me about yourself";
        const result = await aiDetection(question);
        expect(result).toHaveProperty('question', question);
        expect(result).toHaveProperty('model');
        expect(result).toHaveProperty('confidence');
        expect(result).toHaveProperty('result');
        expect(result).toHaveProperty('timeTaken');
    });

    it('should return an error for an unknown question', async () => {
        const question = "Unknown question";
        const result = await aiDetection(question);
        expect(result).toHaveProperty('error', 'Invalid question');
    });

    it('should return an error when all models fail', async () => {
        const question = "Tell me about yourself";
        jest.spyOn(Math, 'random').mockReturnValue(0.99);
        const result = await aiDetection(question);
        expect(result).toHaveProperty('error', 'All models failed');
        expect(result).toHaveProperty('failures');
        expect(result).toHaveProperty('timeTaken');
        Math.random.mockRestore();
    }, 15000);
});
