import { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Button, 
  TextInput, 
  Textarea, 
  NumberInput,
  Select,
  Stack,
  Card,
  Text,
  ActionIcon,
  Divider,
  TagsInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useNavigate, useParams } from 'react-router-dom';
import { IconTrash, IconPlus } from '@tabler/icons-react';
import { PageHeader } from '../components/PageHeader';

interface RecipeFormData {
  title: string;
  description: string;
  ingredients: Array<{ name: string; amount: number; unit: string; notes: string }>;
  instructions: string[];
  prepTime: number | undefined;
  cookTime: number | undefined;
  servings: number | undefined;
  difficulty: 'easy' | 'medium' | 'hard' | undefined;
  tags: string[];
  imageUrl: string;
}

const unitOptions = [
  'g', 'kg', 'ml', 'l', 'cups', 'tbsp', 'tsp', 'piece', 'pieces', 'cloves', 'slices'
];

const difficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' }
];

export function RecipeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RecipeFormData>({
    initialValues: {
      title: '',
      description: '',
      ingredients: [{ name: '', amount: 0, unit: 'g', notes: '' }],
      instructions: [''],
      prepTime: undefined,
      cookTime: undefined,
      servings: undefined,
      difficulty: undefined,
      tags: [],
      imageUrl: ''
    },
    validate: {
      title: (value) => value.trim().length === 0 ? 'Title is required' : null,
      ingredients: (value) => {
        const validIngredients = value.filter(ing => ing.name.trim().length > 0);
        return validIngredients.length === 0 ? 'At least one ingredient is required' : null;
      },
      instructions: (value) => {
        const validInstructions = value.filter(inst => inst.trim().length > 0);
        return validInstructions.length === 0 ? 'At least one instruction is required' : null;
      }
    }
  });

  useEffect(() => {
    if (isEditMode && id) {
      // In a real app, you would fetch the recipe data here
      // For now, we'll just show the form in edit mode
    }
  }, [isEditMode, id]);

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Recipe submission will be implemented when backend is ready
      // For now, just navigate back to recipes list
      navigate('/recipes');
    } catch {
      // Handle error appropriately in production
    } finally {
      setIsLoading(false);
    }
  };

  const addIngredient = () => {
    form.insertListItem('ingredients', { name: '', amount: 0, unit: 'g', notes: '' });
  };

  const removeIngredient = (index: number) => {
    form.removeListItem('ingredients', index);
  };

  const addInstruction = () => {
    form.insertListItem('instructions', '');
  };

  const removeInstruction = (index: number) => {
    form.removeListItem('instructions', index);
  };

  return (
    <Container size="md" py="xl">
      <PageHeader currentPage="recipe-form" />

      <Title order={1} mb="xl">
        {isEditMode ? 'Edit Recipe' : 'Create New Recipe'}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          {/* Basic Information */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={2} size="h3" mb="md">Basic Information</Title>
            
            <Stack gap="md">
              <TextInput
                label="Recipe Title"
                placeholder="Enter recipe title"
                required
                {...form.getInputProps('title')}
              />

              <Textarea
                label="Description"
                placeholder="Brief description of the recipe"
                minRows={2}
                maxRows={4}
                {...form.getInputProps('description')}
              />

              <TextInput
                label="Image URL"
                placeholder="https://example.com/image.jpg"
                {...form.getInputProps('imageUrl')}
              />

              <Group grow>
                <NumberInput
                  label="Prep Time (minutes)"
                  placeholder="15"
                  min={0}
                  {...form.getInputProps('prepTime')}
                />
                <NumberInput
                  label="Cook Time (minutes)"
                  placeholder="30"
                  min={0}
                  {...form.getInputProps('cookTime')}
                />
                <NumberInput
                  label="Servings"
                  placeholder="4"
                  min={1}
                  {...form.getInputProps('servings')}
                />
              </Group>

              <Group grow>
                <Select
                  label="Difficulty"
                  placeholder="Select difficulty"
                  data={difficultyOptions}
                  {...form.getInputProps('difficulty')}
                />
              </Group>

              <TagsInput
                label="Tags"
                placeholder="Add tags (e.g., vegetarian, italian, dessert)"
                {...form.getInputProps('tags')}
              />
            </Stack>
          </Card>

          {/* Ingredients */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={2} size="h3">Ingredients</Title>
              <Button leftSection={<IconPlus size={16} />} onClick={addIngredient}>
                Add Ingredient
              </Button>
            </Group>

            <Stack gap="md">
              {form.values.ingredients.map((_, index) => (
                <Group key={index} align="flex-end">
                  <TextInput
                    placeholder="Ingredient name"
                    style={{ flex: 2 }}
                    {...form.getInputProps(`ingredients.${index}.name`)}
                  />
                  <NumberInput
                    placeholder="Amount"
                    style={{ flex: 1 }}
                    min={0}
                    step={0.1}
                    {...form.getInputProps(`ingredients.${index}.amount`)}
                  />
                  <Select
                    placeholder="Unit"
                    data={unitOptions}
                    style={{ flex: 1 }}
                    {...form.getInputProps(`ingredients.${index}.unit`)}
                  />
                  <TextInput
                    placeholder="Notes (optional)"
                    style={{ flex: 1 }}
                    {...form.getInputProps(`ingredients.${index}.notes`)}
                  />
                  {form.values.ingredients.length > 1 && (
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => removeIngredient(index)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  )}
                </Group>
              ))}
            </Stack>
          </Card>

          {/* Instructions */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={2} size="h3">Instructions</Title>
              <Button leftSection={<IconPlus size={16} />} onClick={addInstruction}>
                Add Step
              </Button>
            </Group>

            <Stack gap="md">
              {form.values.instructions.map((_, index) => (
                <Group key={index} align="flex-start">
                  <Text size="sm" style={{ minWidth: '2rem', paddingTop: '0.5rem' }}>
                    {index + 1}.
                  </Text>
                  <Textarea
                    placeholder={`Step ${index + 1}`}
                    style={{ flex: 1 }}
                    minRows={2}
                    {...form.getInputProps(`instructions.${index}`)}
                  />
                  {form.values.instructions.length > 1 && (
                    <ActionIcon
                      color="red"
                      variant="light"
                      onClick={() => removeInstruction(index)}
                      style={{ marginTop: '0.5rem' }}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  )}
                </Group>
              ))}
            </Stack>
          </Card>

          <Divider />

          {/* Action Buttons */}
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => navigate('/recipes')}>
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              {isEditMode ? 'Update Recipe' : 'Create Recipe'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}