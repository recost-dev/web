declare namespace google {
  namespace accounts {
    namespace oauth2 {
      interface CodeClient {
        requestCode(): void;
      }
      interface CodeClientConfig {
        client_id: string;
        scope: string;
        ux_mode: 'popup' | 'redirect';
        callback: (response: { code: string; error?: string }) => void;
      }
      function initCodeClient(config: CodeClientConfig): CodeClient;
    }
  }
}
