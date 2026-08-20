type IntegrationFlowStepsProps = {
  steps: string[];
};

/**
 * Numbered list describing an integration sequence.
 * @param props Ordered step labels.
 * @returns The ordered list markup.
 */
export const IntegrationFlowSteps = (props: IntegrationFlowStepsProps) => (
  <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-stone-700">
    {props.steps.map((step) => (
      <li key={step}>{step}</li>
    ))}
  </ol>
);
