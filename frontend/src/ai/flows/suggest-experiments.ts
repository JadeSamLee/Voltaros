'use server';

/**
 * @fileOverview An AI agent that suggests chaos experiments based on historical data and system behavior.
 *
 * - suggestExperiments - A function that suggests chaos experiments.
 * - SuggestExperimentsInput - The input type for the suggestExperiments function.
 * - SuggestExperimentsOutput - The return type for the suggestExperiments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestExperimentsInputSchema = z.object({
  historicalData: z
    .string()
    .describe(
      'Historical data of the system, including logs, metrics, and events.'
    ),
  systemBehavior: z
    .string()
    .describe('Description of the current system behavior and architecture.'),
});
export type SuggestExperimentsInput = z.infer<typeof SuggestExperimentsInputSchema>;

const SuggestExperimentsOutputSchema = z.object({
  experiments: z
    .array(z.string())
    .describe(
      'A list of suggested chaos experiments to identify potential vulnerabilities.'
    ),
  rationale: z
    .string()
    .describe(
      'The rationale behind the suggested experiments, explaining why they are relevant to the system behavior and historical data.'
    ),
});
export type SuggestExperimentsOutput = z.infer<typeof SuggestExperimentsOutputSchema>;

export async function suggestExperiments(
  input: SuggestExperimentsInput
): Promise<SuggestExperimentsOutput> {
  return suggestExperimentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestExperimentsPrompt',
  input: {schema: SuggestExperimentsInputSchema},
  output: {schema: SuggestExperimentsOutputSchema},
  prompt: `You are an AI-powered chaos engineering expert. Based on the historical data and system behavior provided, suggest a list of chaos experiments to identify potential vulnerabilities.

Historical Data: {{{historicalData}}}
System Behavior: {{{systemBehavior}}}

Suggest a diverse set of experiments that cover different aspects of the system and target potential weaknesses. Provide a rationale for each suggested experiment, explaining why it is relevant to the system behavior and historical data.

Experiments:`,
});

const suggestExperimentsFlow = ai.defineFlow(
  {
    name: 'suggestExperimentsFlow',
    inputSchema: SuggestExperimentsInputSchema,
    outputSchema: SuggestExperimentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
