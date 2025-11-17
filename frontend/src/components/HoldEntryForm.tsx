type HoldEntryFormProps = {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function HoldEntryForm(props: HoldEntryFormProps) {
  const {onSuccess, onError} = props;

  return (<div>Hold Entry Form</div>);

}