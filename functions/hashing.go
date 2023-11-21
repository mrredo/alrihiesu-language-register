package functions

import (
	"crypto/sha256"
	"encoding/hex"
)

func HashString(s string) string {
	hasher := sha256.New()
	hasher.Write([]byte(s))
	hashedPassword := hasher.Sum(nil)
	return hex.EncodeToString(hashedPassword)
}
