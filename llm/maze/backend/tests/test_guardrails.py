from app.guardrails import apply_guardrail, contains_flag


def test_redacts_literal_flag() -> None:
    assert apply_guardrail("the token is flag{abc123} ok") == "the token is [REDACTED] ok"


def test_redacts_multiple_occurrences() -> None:
    assert apply_guardrail("flag{a} and flag{b}") == "[REDACTED] and [REDACTED]"


def test_case_insensitive() -> None:
    assert apply_guardrail("FLAG{ABC}") == "[REDACTED]"
    assert contains_flag("Flag{AbC}") is True


def test_does_not_catch_transformed_tokens() -> None:
    # The intended bypasses: spacing, inner-only, reversed, encoded.
    assert apply_guardrail("f l a g { a b c }") == "f l a g { a b c }"
    assert apply_guardrail("the inner part is abc123") == "the inner part is abc123"
    assert apply_guardrail("321cba") == "321cba"
    assert apply_guardrail("ZmxhZ3thYmN9") == "ZmxhZ3thYmN9"


def test_plain_text_untouched() -> None:
    assert apply_guardrail("hello world") == "hello world"
