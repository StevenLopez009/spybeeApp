"use client";

import React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";

export default function AntdRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const cache = React.useMemo(() => createCache(), []);

  useServerInsertedHTML(() => (
    <style
      id="antd-cssinjs"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ));

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider locale={esES}>{children}</ConfigProvider>
    </StyleProvider>
  );
}
