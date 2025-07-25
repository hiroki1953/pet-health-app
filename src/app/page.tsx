import { Button, Card, Container, Text, Title } from "@mantine/core";

export default function HomePage() {
  return (
    <Container my={40}>
      <Title ta="center" c="blue">
        Next.js + Mantine + Tailwind CSS
      </Title>

      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        RSCとSupabaseを使用したアプリケーション
      </Text>

      <div>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Text fw={500}>Mantine Card</Text>
          <Text size="sm" c="dimmed">
            MantineとTailwindが正常に動作しています
          </Text>
          <Button variant="light" color="blue" fullWidth mt="md" radius="md">
            Book classic tour now
          </Button>
        </Card>
      </div>
    </Container>
  );
}
