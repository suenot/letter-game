import React from "react";
import { useAsync } from "@/lib/use-async";
import { gameService } from "@/src/api";
import { Loading, LoadingFull } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-message";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function TopicList() {
  const { data: topics, isLoading, error } = useAsync(gameService.getTopics, { immediate: true });

  if (isLoading) {
    return <LoadingFull />;
  }

  if (error) {
    return <ErrorMessage error={error} className="m-4" />;
  }

  if (!topics || topics.length === 0) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <p className="text-muted-foreground">No topics available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => (
        <Card key={topic.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {topic.name}
              {topic.completed && (
                <Badge variant="secondary" className="ml-2">
                  Completed
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              {topic.description}
            </p>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">{topic.words_count} words</Badge>
              <Button asChild>
                <Link href={`/topics/${topic.id}`}>Start Learning</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
