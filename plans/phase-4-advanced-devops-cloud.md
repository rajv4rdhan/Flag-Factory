# Phase 4 — Advanced DevOps & Cloud

**Goal:** wrap the deployed, MLOps-managed challenges in a production-grade
platform: GitOps delivery, a secure supply chain, observability, autoscaling,
policy enforcement, and cloud portability via Terraform.

**Depends on:** Phases 1–3.

---

## 1. GitOps (ArgoCD)

- Install **ArgoCD**; Git is the single source of truth.
- **App-of-apps**: a root application manages:
  - `gitops/platform/` — ingress, cert-manager, Kyverno, KEDA, secrets operator
  - `gitops/observability/` — Prometheus/Grafana/Loki
  - `gitops/apps/` — `zoo`, `maze`, and the MLOps stack
- **Sync waves** so CRDs/controllers install before apps.
- Automated sync with `prune` + `selfHeal` for dev; manual gates for prod.
- After this phase, **no `kubectl apply`** for app changes.

## 2. CI/CD + software supply chain

`.github/workflows/` (path-filtered, separate from Zoo's existing workflow):

- **lint** — ruff, eslint, hadolint, helm lint, kubeconform.
- **build** — Docker Buildx, `linux/amd64`, `gha` cache.
- **scan** — Trivy; fail on HIGH/CRITICAL.
- **SBOM** — Syft.
- **sign** — Cosign keyless (Sigstore/OIDC).
- **push** — GHCR **by digest**; never rely on `latest`.
- **promote** — ArgoCD Image Updater or bot commit: digest `dev → staging → prod`
  with a GitHub Environment approval for prod.

## 3. Observability

- **kube-prometheus-stack** + **Grafana** + **Loki** (namespace `observability`).
- `ServiceMonitor`s for the challenge backend and the inference server.
- Dashboards **as code**:
  - request rate, p50/p95 latency
  - **TTFT** (time to first token), **tokens/sec**, **queue depth**
  - CPU/mem, error rate, pod restarts
  - challenge-specific: **refusal rate**, **flag-leak attempts**, **jailbreak
    success ratio**
- Alerts: latency/error SLO breaches, inference down, abuse/cost spikes.

## 4. Autoscaling

- **KEDA** `ScaledObject` driven by concurrency/queue depth (local-friendly).
- In cloud, **Knative/KServe scale-to-zero** for the inference service.
- Load-test to verify scale up + cooldown, and that cold starts are acceptable.

## 5. Security hardening

- **Kyverno** admission policies: no `:latest`, require non-root + read-only
  rootfs + resource limits, **verify Cosign signatures**.
- **External Secrets** (cloud) / **Sealed Secrets** (local): no plaintext
  secrets in Git; flags and creds from a secret store.
- **NetworkPolicy** default-deny (Calico/Cilium): backend → inference only;
  only ingress reaches frontends.
- **Ingress rate limiting + WAF** (ingress-nginx + ModSecurity/OWASP CRS) — the
  public LLM endpoint is the primary abuse/cost risk.
- Optional **service mesh** (Linkerd/Istio) for mTLS + traffic policy.

## 6. Cloud + Terraform

- `infra/terraform/modules/` with identical outputs:
  `network`, `cluster`, `registry`, `secrets`, `k8s-bootstrap`.
- `infra/terraform/envs/`:
  - `local` — document/reproduce k3d.
  - `azure` — AKS + ACR + Key Vault + Log Analytics; remote state in Blob.
  - `aws` (stub) — EKS + ECR + Secrets Manager + CloudWatch; state in S3.
- `.github/workflows/terraform.yml`: `fmt -check`, `validate`, `tflint`,
  `checkov`, `plan` on PR; `apply` gated by approval.
- Cloud profile switches: Knative scale-to-zero, External Secrets, managed
  ingress/DNS/TLS.
- **Cost controls:** spot nodes, scale-to-zero, scheduled shutdown, budget
  alerts. Do not leave cloud running.

## 7. Resilience & operations

- **Velero** backups (cluster state) in cloud.
- **Progressive delivery** (canary/blue-green) for the challenge.
- Runbooks: deploy, rollback, rotate flag, promote model, incident response.

---

## Deliverables

- `gitops/` (bootstrap root app + platform/observability/apps)
- `.github/workflows/{maze-ci.yml,maze-model.yml,terraform.yml}`
- `gitops/observability/` dashboards + alerts
- KEDA `ScaledObject`s, Kyverno policies, NetworkPolicies, WAF config
- `infra/terraform/{modules,envs}`
- `docs/runbook.md`

## Done when

- A Git commit auto-deploys through ArgoCD; the cluster matches Git.
- CI produces a **signed, scanned image by digest** and ArgoCD rolls it out.
- Grafana shows live inference metrics (TTFT, tokens/sec) for the challenge.
- Autoscaling scales the inference service under load and back down.
- A policy violation (unsigned image, `:latest`) is **blocked at admission**.
- Secrets resolve from the secret store; none are in Git.
- `terraform apply` reproduces the local stack and can target a cloud cluster
  with only env values changed.

## Notes

- This is the "extra" layer: it is optional for a working challenge but is the
  resume/portfolio centerpiece.
- Keep `web/zoo`'s existing Render pipeline working; add the new workflows
  alongside, path-filtered so they do not conflict.
- Add the new challenge and stack to `project-knowledge.yaml` when done.
