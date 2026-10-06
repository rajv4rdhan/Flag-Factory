from app.ratelimit import SlidingWindowLimiter


def test_allows_up_to_limit_then_denies() -> None:
    limiter = SlidingWindowLimiter(limit=3, window_seconds=60)
    assert limiter.allow("k") is True
    assert limiter.allow("k") is True
    assert limiter.allow("k") is True
    assert limiter.allow("k") is False


def test_keys_are_independent() -> None:
    limiter = SlidingWindowLimiter(limit=1, window_seconds=60)
    assert limiter.allow("a") is True
    assert limiter.allow("b") is True
    assert limiter.allow("a") is False


def test_window_expiry() -> None:
    limiter = SlidingWindowLimiter(limit=1, window_seconds=0.01)
    assert limiter.allow("k") is True
    import time

    time.sleep(0.02)
    assert limiter.allow("k") is True
