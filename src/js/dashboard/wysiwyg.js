$("#description").summernote({
  placeholder: "Write something!",
  tabsize: 2,
  height: 150,
  toolbar: [
    ["style", ["style"]],
    ["font", ["bold", "underline", "clear"]],
    ["para", ["ul", "ol", "paragraph"]],
    ["insert", ["link", "picture"]],
    ["view", ["codeview"]],
  ],
});
