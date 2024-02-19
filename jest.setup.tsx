import "regenerator-runtime/runtime";
import "@testing-library/jest-dom";
import "intersection-observer";
import { useQuery } from "@tanstack/react-query";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TextDecoder, TextEncoder } from "util";
import * as React from "react";
import { lightTheme } from "@deskpro/deskpro-ui";
import { mockClient, mockTicketContext } from "./testing";
import type { IDeskproClient } from "@deskpro/app-sdk";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.TextEncoder = TextEncoder;
//for some reason the types are wrong, but this works
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.TextDecoder = TextDecoder;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
global.React = React;

jest.mock("@deskpro/app-sdk", () => ({
  ...jest.requireActual("@deskpro/app-sdk"),
  useDeskproAppClient: () => ({ client: mockClient }),
  useDeskproAppEvents: (
    hooks: { [key: string]: (param: Record<string, unknown>) => void },
    deps: [] = []
  ) => {
    React.useEffect(() => {
      !!hooks.onChange && hooks.onChange(mockTicketContext);
      !!hooks.onShow && hooks.onShow(mockTicketContext);
      !!hooks.onReady && hooks.onReady(mockTicketContext);
      !!hooks.onAdminSettingsChange && hooks.onAdminSettingsChange(mockTicketContext.settings);
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, deps);
  },
  useInitialisedDeskproAppClient: (callback: (param: typeof mockClient) => void) => {
    callback(mockClient);
  },
  useDeskproLatestAppContext: () => ({ context: mockTicketContext }),
  useDeskproAppTheme: () => ({ theme: lightTheme }),
  proxyFetch: async () => fetch,
  LoadingSpinner: () => <>Loading...</>,
  useQueryWithClient: (
    queryKey: string[],
    queryFn: (client: IDeskproClient) => Promise<void>,
    options: object,
  ) => useQuery(queryKey, () => queryFn(mockClient as never), options),
}));
