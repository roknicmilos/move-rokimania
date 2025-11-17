type RepsEntryFormProps = {
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export default function RepsEntryForm(props: RepsEntryFormProps) {
  const {onSuccess, onError} = props;

  return (<div>Reps Entry Form</div>);

}
