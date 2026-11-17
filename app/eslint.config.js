const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')
const prettier = require('eslint-plugin-prettier/recommended')

module.exports = defineConfig([
  expoConfig,
  prettier,
  { ignores: ['dist/*', '.expo/*'] },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/components/atoms/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-native',
              importNames: ['Text', 'TextInput', 'Pressable', 'TouchableOpacity'],
              message: 'Use the atoms in @/components/atoms.'
            }
          ]
        }
      ]
    }
  }
])
