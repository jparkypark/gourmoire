import { Container, Title, Button, Card, Text, Badge, Grid, Stack } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { mockRecipes } from '../data/mockRecipes';


export function RecipeListPage() {
  const navigate = useNavigate();

  const handleEditRecipe = (recipeId: string) => {
    navigate(`/recipes/${recipeId}/edit`);
  };


  return (
    <Container size="lg" py="xl">
      <PageHeader currentPage="recipes" />

      <Group justify="space-between" mb="xl" mt="md">
        <Title order={1}>My Recipes</Title>
        <Button 
          component={Link} 
          to="/recipes/new"
          variant="filled"
        >
          Add New Recipe
        </Button>
      </Group>

      {mockRecipes.length === 0 ? (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack align="center" gap="md">
            <Text size="lg" c="dimmed">No recipes found</Text>
            <Text c="dimmed">Create your first recipe to get started!</Text>
            <Button component={Link} to="/recipes/new">
              Create Recipe
            </Button>
          </Stack>
        </Card>
      ) : (
        <Grid>
          {mockRecipes.map((recipe) => (
            <Grid.Col key={recipe.id} span={{ base: 12, sm: 6, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                <Stack justify="space-between" h="100%">
                  <div>
                    <Title order={3} size="h4" mb="sm">
                      {recipe.title}
                    </Title>
                    
                    {recipe.description && (
                      <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
                        {recipe.description}
                      </Text>
                    )}

                    <Group gap="xs" mb="md">
                      {recipe.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="light" size="sm">
                          {tag}
                        </Badge>
                      ))}
                      {recipe.tags.length > 3 && (
                        <Badge variant="light" size="sm" c="dimmed">
                          +{recipe.tags.length - 3}
                        </Badge>
                      )}
                    </Group>

                    <Group gap="md" mb="md">
                      {recipe.prepTime && (
                        <Text size="xs" c="dimmed">
                          Prep: {recipe.prepTime}min
                        </Text>
                      )}
                      {recipe.cookTime && (
                        <Text size="xs" c="dimmed">
                          Cook: {recipe.cookTime}min
                        </Text>
                      )}
                      {recipe.servings && (
                        <Text size="xs" c="dimmed">
                          Serves: {recipe.servings}
                        </Text>
                      )}
                    </Group>

                    {recipe.difficulty && (
                      <Badge 
                        color={
                          recipe.difficulty === 'easy' ? 'green' : 
                          recipe.difficulty === 'medium' ? 'yellow' : 'red'
                        }
                        variant="light"
                        size="sm"
                        mb="md"
                      >
                        {recipe.difficulty}
                      </Badge>
                    )}
                  </div>

                  <Group justify="flex-end">
                    <Button 
                      variant="light" 
                      size="sm"
                      onClick={() => handleEditRecipe(recipe.id)}
                    >
                      Edit
                    </Button>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
}