export default function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"], // Define your project's root folder for aliases
          alias: {
            "@components": "./src/app/components",
            "@utils": "./src/app/utils",
            // Add more aliases as needed
          },
        },
      ],
      "react-native-worklets/plugin",
    ],
  };
}
